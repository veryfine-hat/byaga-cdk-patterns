import {
    AccessLevel,
    AllowedMethods,
    CachePolicy,
    Distribution,
    type ErrorResponse,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import type {Bucket} from "aws-cdk-lib/aws-s3";
import {S3BucketOrigin} from "aws-cdk-lib/aws-cloudfront-origins";
import type {CertificateDetails} from "../route53";
import {output, genId, getCurrentStack} from "../cloud-formation";
import {Effect, PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";

export interface CouldFrontDistributionConfig {
    s3BucketSource: Bucket
    errorResponses?: ErrorResponse[]
    shouldCache?: boolean
    certificate: CertificateDetails,
    webAclId?: string
}

/**
 * Initializes a CloudFront distribution with common properties needed by your average static SPA site.
 * @param id - The identifier for the distribution which will be used to compute the ids of all resources created to support it.
 * @param config - The pieces of the distribution that can/should be customized for a specific use case.
 */
export function createDistribution(id: string, config: CouldFrontDistributionConfig) {
    const distro = new Distribution(getCurrentStack().stack, genId(id, 'distribution'), {
        enabled: true,
        defaultRootObject: 'index.html',
        errorResponses: config.errorResponses,
        defaultBehavior: {
            origin: S3BucketOrigin.withOriginAccessControl(config.s3BucketSource, {
                originAccessLevels: [AccessLevel.READ]
            }),
            allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: config.shouldCache ? CachePolicy.CACHING_OPTIMIZED : CachePolicy.CACHING_DISABLED
        },
        certificate: config.certificate.certificate,
        domainNames: [config.certificate.domain],
        webAclId: config.webAclId
    })
    config.s3BucketSource.addToResourcePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [config.s3BucketSource.bucketArn, config.s3BucketSource.bucketArn + '/*'],
        actions: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        conditions: {
            StringEquals: {
                'AWS:SourceArn': `arn:aws:cloudfront::${getCurrentStack().stack.account}:distribution/${distro.distributionId}`
            }
        }
    }))

    output(`${id}-base-url`, "https://" + config.certificate.domain);
    return distro
}