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
import {Duration} from "aws-cdk-lib";

/**
 * Configuration interface for the StaticWebSite class.
 */
export interface StaticWebSiteConfig {
    srcDir?: string,
    domain: IDomainConfig,
    env: NodeJS.ProcessEnv,
    proxy?: SourceConfiguration[]
}

/**
 * Logic which will setup a static web site in AWS with an S3 Bucket, CloudFront Distribution, and Route53 A-Name Record.
 */
export class StaticWebSite {
    /**
     * Constructs a new StaticWebSite instance.
     * @param {DeployStack} stack - The deployment stack.
     * @param {string} id - The ID of the website.
     * @param {StaticWebSiteConfig} props - The configuration properties of the website.
     */
    constructor(stack: DeployStack, id: string, props: StaticWebSiteConfig) {
        console.log('Deploying Static Web Site', id)

        const done = duration()
        const buildDir = buildNodeSource('web', id)

        console.log('Building UI Source', id)
        execSync('npm run export', {
                cwd: buildDir,
                env: props.env
        })

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
            autoDeleteObjects: true,
            publicReadAccess: false,
            blockPublicAccess: {
                blockPublicAcls: true,
                blockPublicPolicy: true,
                ignorePublicAcls: true,
                restrictPublicBuckets: true
            }
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

    /**
     * Defines a proxy for the static website.
     * @param {DeployStack} stack - The deployment stack.
     * @param {string} domainName - The domain name.
     * @param {string} pathPattern - The path pattern.
     * @returns {SourceConfiguration} The source configuration for the proxy.
     */
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
        }    }
}