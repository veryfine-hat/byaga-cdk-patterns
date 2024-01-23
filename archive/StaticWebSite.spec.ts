import {StaticWebSite, StaticWebSiteConfig} from './StaticWebSite';
import {DeployStack} from './DeployStack';
import {Bucket} from "aws-cdk-lib/aws-s3";
import {BucketDeployment} from "aws-cdk-lib/aws-s3-deployment";
import {CloudFrontWebDistribution, OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {execSync} from "child_process";
import {buildNodeSource} from './methods/build-node-source';
import duration from './methods/duration';

jest.mock('child_process');
jest.mock('./methods/build-node-source');
jest.mock('./methods/duration');
jest.mock('./Output');
jest.mock('./ApiCertificate');
jest.mock('aws-cdk-lib/aws-s3');
jest.mock('aws-cdk-lib/aws-s3-deployment');
jest.mock('aws-cdk-lib/aws-cloudfront');
jest.mock('aws-cdk-lib/aws-iam');
jest.mock('aws-cdk-lib/aws-route53');
jest.mock('aws-cdk-lib/aws-route53-targets');

let stack: DeployStack;
let id: string;
let props: StaticWebSiteConfig;

beforeEach(() => {
    jest.clearAllMocks();
    stack = {
        genName: jest.fn(),
        genId: jest.fn(),
    } as unknown as DeployStack;
    id = 'id';
    props = {
        srcDir: 'srcDir',
        domain: {
            domainName: 'domainName',
            hostedZone: {
                name: 'test-zone',
                id: 'hostedZoneId'
            },
        },
        env: process.env,
        proxy: [],
    };
    (buildNodeSource as jest.Mock).mockReturnValue('build-dir');
    (duration as jest.Mock).mockReturnValue(() => 1000);
    (execSync as jest.Mock).mockReturnValue(undefined);
});

it('should deploy a static website', () => {
    new StaticWebSite(stack, id, props);

    expect(buildNodeSource).toHaveBeenCalledWith('web', id);
    expect(execSync).toHaveBeenCalledWith('npm run export', {
        cwd: 'build-dir',
        env: process.env,
    });
    expect(Bucket).toHaveBeenCalledWith(stack, stack.genId(id, "content-bucket"), expect.any(Object));
    expect(BucketDeployment).toHaveBeenCalledWith(stack, stack.genId(id, 'bucket-deployment'), expect.any(Object));
    expect(OriginAccessIdentity).toHaveBeenCalledWith(stack, "WebsiteOAI");
    expect(CloudFrontWebDistribution).toHaveBeenCalledWith(stack, stack.genId(id, 'cloudfront-web-distribution'), expect.any(Object));
    expect(ARecord).toHaveBeenCalledWith(stack, stack.genId('alias'), expect.any(Object));
});

it('should define a proxy for the static website', () => {
    const domainName = 'domainName';
    const pathPattern = 'pathPattern';

    const result = StaticWebSite.defineProxy(stack, domainName, pathPattern);

    expect(result).toEqual(expect.any(Object));
});