import {RemovalPolicy} from "aws-cdk-lib/core";
import {Output} from './Output'
import {DeployStack} from "./DeployStack";
import {execSync} from "child_process";
import {Bucket} from "aws-cdk-lib/aws-s3"
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment"
import ApiCertificate from "./ApiCertificate";
import {
    CloudFrontAllowedMethods,
    CloudFrontWebDistribution,
    OriginAccessIdentity,
    OriginProtocolPolicy, SourceConfiguration,
    SSLMethod,
    ViewerCertificate,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront"
import IDomainConfig from "./IDomainConfig";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";
import {ARecord, RecordTarget} from "aws-cdk-lib/aws-route53";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";
import duration from './methods/duration';
import {buildNodeSource} from './methods/build-node-source'
import {IIgnoreOptions, no} from "./methods/walk-directory";
import {Duration} from "aws-cdk-lib";
import {RestApi} from "./RestApi";

interface StaticWebSiteConfig {
    srcDir?: string,
    domain: IDomainConfig,
    env: NodeJS.ProcessEnv,
    ignore?: IIgnoreOptions,
    proxy?: SourceConfiguration[]
}

export class StaticWebSite {
    constructor(stack: DeployStack, id: string, props: StaticWebSiteConfig) {
        console.log('Deploying Static Web Site', id)

        const done = duration()
        const childrenExcluded = props.ignore?.childrenExcluded || no;
        const {buildDir, moduleChanged} = buildNodeSource('web', id, {
            ignore: {
                ...props.ignore,
                childrenExcluded: stat => stat.name === 'out' || childrenExcluded(stat)
            }
        })

        if (moduleChanged) {
            console.log('Building UI Source', id)
            execSync('npm run export', {
                    cwd: buildDir,
                    env: props.env
            })
        }
        console.log('Total Build Duration (ms)', done())
        const exportDir: string = buildDir + '/out';

        console.log('Creating HTTPS Certificate', id + '-certificate')
        const certificate = new ApiCertificate(stack, id + '-certificate', props.domain);
        console.log('Deploying Site Content Bucket', stack.genId(id, "content-bucket"))
        const s3BucketSource = new Bucket(stack, stack.genId(id, "content-bucket"), {
            bucketName: certificate.domain,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });
        new Output(stack, `${id}-content-bucket`, s3BucketSource.bucketName);

        const cloudFrontPolicy = new PolicyStatement({
            actions: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
            resources: [s3BucketSource.bucketArn, s3BucketSource.bucketArn + '/*'],
        })

        new BucketDeployment(stack, stack.genId(id, 'bucket-deployment'), {
            sources: [Source.asset(exportDir)],
            destinationBucket: s3BucketSource
        })
        const originAccessIdentity = new OriginAccessIdentity(stack, "WebsiteOAI");
         cloudFrontPolicy.addArnPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId);
         s3BucketSource.grantRead(originAccessIdentity)

        const distro = new CloudFrontWebDistribution(stack, stack.genId(id, 'cloudfront-web-distribution'), {
            enabled: true,
             originConfigs: [...props.proxy || [], {
                 s3OriginSource: {
                     s3BucketSource,
                     originAccessIdentity
                 },
                 behaviors: [{
                     allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                     isDefaultBehavior: true
                 }]
             }],
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
                aliases: [certificate.domain],
                sslMethod: SSLMethod.SNI
            })
        })
        new Output(stack, `${id}-base-url`, "https://" + certificate.domain);

        console.log('Setting Route53 A-Name Record', props.domain.domainName)
         new ARecord(stack, stack.genId('alias'), {
             zone: certificate.hostedZone,
             recordName: certificate.domain,
             target: RecordTarget.fromAlias(new CloudFrontTarget(distro))
         })
    }

    static defineProxy(stack: DeployStack, domainName: string, pathPattern: string): SourceConfiguration {
        return {
            customOriginSource: {
                domainName: domainName,
                originPath:  `/${stack.stage}`,
                originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
            },
            behaviors: [{
                pathPattern,
                allowedMethods: CloudFrontAllowedMethods.ALL,
                maxTtl: Duration.seconds(0),
                minTtl: Duration.seconds(0),
                defaultTtl: Duration.seconds(0),
                compress: false,
                forwardedValues: {
                    queryString: true,
                    headers: [
                        "Authorization",
                        "User-Agent",
                        "X-Trace-Id",
                        "X-Span-Id",
                        "X-Correlation-Id",
                        'Referer',
                        "User-Agent",
                        "Accept-Language",
                        'Content-Type',
                        'Content-Length'
                    ]
                }
            }]
        }
    }
}