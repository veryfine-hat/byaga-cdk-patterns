import { Construct } from 'constructs'
import { CfnAuthorizer, IAuthorizer } from 'aws-cdk-lib/aws-apigateway'
import { CfnAuthorizerProps } from 'aws-cdk-lib/aws-apigateway/lib/apigateway.generated'

/**
 * Custom construct that implements a Cognito based API Gateway Authorizer.
 *
 * @see https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_author
 *
 * @see https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.CfnAuthorizer.html
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-authorizer.html
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enable-cognito-user-pool.html
 *
 * @see https://github.com/aws/aws-cdk/issues/5618#issuecomment-666922559
 */
export class CognitoApiGatewayAuthorizer extends CfnAuthorizer implements IAuthorizer {
    public readonly authorizerId: string

    constructor(scope: Construct, id: string, props: CfnAuthorizerProps) {
        super(scope, id, props)

        this.authorizerId = this.ref
    }
}