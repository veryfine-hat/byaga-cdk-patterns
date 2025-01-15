import {spawnSync} from "child_process";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment"
import {ARecord, RecordTarget} from "aws-cdk-lib/aws-route53";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";
import {getCurrentStack, genId} from '../cloud-formation'
import {getSourceDirectory, getBuildDirectory} from "../build";
import {createBucket} from '../s3'
import {apiCertificate, type IDomainConfig} from "../route53";
import {duration} from '../tools';
import {createDistribution} from "../cloud-front";

/**
 * Configuration interface for the StaticWebSite class.
 */
export interface StaticWebSiteConfig {
    domain: IDomainConfig,
    env?: NodeJS.ProcessEnv,
    shouldCache?: boolean
}

/**
 * Sets up a basic static website in AWS with an S3 Bucket, CloudFront Distribution, and Route53 A-Name Record.
 */
export function staticWebSite(id: string, props: StaticWebSiteConfig) {
    console.log('Deploying Static Web Site', id)
    const {stack} = getCurrentStack()

    const done = duration()
    const buildDir = getBuildDirectory('web', id)
    const cwd = getSourceDirectory('web', id)

    spawnSync('npm i', {cwd})

    console.log('Building UI Source', id)
    spawnSync('npm run export', {
        cwd,
        env: { ...props.env }
    })

    console.log('Total Build Duration (ms)', done())

    const certificate = apiCertificate(id + '-certificate', props.domain);
    const s3BucketSource = createBucket(`${id}-content`, {
        bucketName: certificate.domain
    });

    const distribution = createDistribution(id, {
        shouldCache: props.shouldCache,
        s3BucketSource,
        certificate,
        errorResponses: [{
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html'
        }]
    })
    new BucketDeployment(stack, genId(id, 'bucket-deployment'), {
        sources: [Source.asset(buildDir)],
        destinationBucket: s3BucketSource,
        distribution,
        distributionPaths: props.shouldCache ? ['/*'] : undefined,
        memoryLimit: 2048
    })

    console.log('Configuring Route53 A-Name Record', props.domain.domainName)
    new ARecord(stack, genId('alias'), {
        zone: certificate.hostedZone,
        recordName: certificate.domain,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    })
}