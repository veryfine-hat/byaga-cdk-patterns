import {BlockPublicAccess, Bucket, BucketAccessControl} from "aws-cdk-lib/aws-s3";
import {RemovalPolicy} from "aws-cdk-lib";
import {output, genId, genName, getCurrentStack} from "../cloud-formation";

export interface BucketConfig {
    bucketName: string,
    versioned?: boolean,
    removalPolicy?: RemovalPolicy
}

export function createBucket(id: string, config?: BucketConfig) {
    console.log('Defining S3 Bucket', genId(id, "bucket"))
    const bucket = new Bucket(getCurrentStack().stack, genId(id, 'bucket'), {
        bucketName: config?.bucketName ?? genName(id, 'bucket'),
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        accessControl: BucketAccessControl.PRIVATE,
        publicReadAccess: false,
        removalPolicy: config?.removalPolicy ?? RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        enforceSSL: true,
        versioned: config?.versioned ?? false
    })
    output(genName(id, 'bucket'), bucket.bucketName);
    
    return bucket;
}