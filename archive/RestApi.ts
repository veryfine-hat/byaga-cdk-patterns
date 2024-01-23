import {
    BasePathMapping,
    ContentHandling,
    DomainName,
    EndpointType,
    IDomainName,
    IResource,
    MockIntegration,
    RestApi as RestApiBase
} from "aws-cdk-lib/aws-apigateway";
import {DeployStack} from "./DeployStack"
import {ICorsConfig} from "./ICorsConfig";
import {Duration, Size} from "aws-cdk-lib";
import {Effect, Policy, PolicyStatement, Role} from "aws-cdk-lib/aws-iam";

interface IRestApiConfig {
    cors?: ICorsConfig,
    allowCredentials: boolean
}

interface IBasePathMappingConfig {
    domain?: IDomainName,
    domainName?: string,
    hostedZoneId?: string
}

interface IResourceNode {
    children: { [key: string]: IResourceNode }
    node: IResource
}

const DEFAULT_EXPOSE_HEADERS = ['Date']

export class RestApi extends RestApiBase {
    _id: string
    _tree: IResourceNode


    constructor(stack: DeployStack, id: string, props: IRestApiConfig) {
        const {stage} = stack

        console.log('Defining Rest API', stack.genId(id, 'api'))

        const cors: ICorsConfig = props.cors || {}
        const allowOrigins: string[] = Array.isArray(cors.allowOrigin) ? cors.allowOrigin : [cors.allowOrigin || '*']
        super(stack, stack.genId(id, 'api'), {
            restApiName: stack.genName('api'),
            deploy: true,
            deployOptions: {
                stageName: stage,
                tracingEnabled: true
            },
            minCompressionSize: Size.bytes(1000),
            endpointConfiguration: {
                types: [EndpointType.EDGE]
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['*'],
                allowCredentials: props.allowCredentials,
                allowOrigins,
                maxAge: Duration.seconds(cors.maxAge || 86400),
                exposeHeaders: cors.exposeHeaders || DEFAULT_EXPOSE_HEADERS
            }
        })
        this._id = id

        // APIs MUST have at least one endpoint, so this will give it one
        console.log('Adding health endpoint', '/health')
        const health = this.root.addResource('health')
        health.addMethod("GET", new MockIntegration({
            requestTemplates: {
                "application/json": "{\"statusCode\": 200}"
            },
            integrationResponses: [{
                statusCode: '200',
                contentHandling: ContentHandling.CONVERT_TO_TEXT,
                responseTemplates: {
                    'application/json': `
##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
#set($allParams = $input.params())
{
"body-json" : $input.json('$'),
"params" : {
#foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
"$type" : {
    #foreach($paramName in $params.keySet())
    "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
    #end
}
    #if($foreach.hasNext),#end
#end
},
"stage-variables" : {
#foreach($key in $stageVariables.keySet())
"$key" : "$util.escapeJavaScript($stageVariables.get($key))"
    #if($foreach.hasNext),#end
#end
},
"context" : {
    "account-id" : "$context.identity.accountId",
    "api-id" : "$context.apiId",
    "api-key" : "$context.identity.apiKey",
    "authorizer-principal-id" : "$context.authorizer.principalId",
    "caller" : "$context.identity.caller",
    "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
    "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
    "cognito-identity-id" : "$context.identity.cognitoIdentityId",
    "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
    "http-method" : "$context.httpMethod",
    "stage" : "$context.stage",
    "source-ip" : "$context.identity.sourceIp",
    "user" : "$context.identity.user",
    "user-agent" : "$context.identity.userAgent",
    "user-arn" : "$context.identity.userArn",
    "request-id" : "$context.requestId",
    "resource-id" : "$context.resourceId",
    "resource-path" : "$context.resourcePath"
    }
}`
                }
            }]
        }), {
            methodResponses: [{statusCode: "200"}]
        })

        this._tree = {node: this.root, children: {}}
    }

    addBasePathMapping(stack: DeployStack, config: IBasePathMappingConfig) {
        let domain = config.domain
        if (!domain && config.domainName && config.hostedZoneId) {
            domain = DomainName.fromDomainNameAttributes(stack, stack.genName('domain-name'), {
                domainName: config.domainName,
                domainNameAliasHostedZoneId: config.hostedZoneId,
                domainNameAliasTarget: this.restApiRootResourceId
            })
        }
        if (!domain) throw new Error('Missing Domain Configuration For Base Path Mapping')

        new BasePathMapping(stack, stack.genId(this._id, 'base-path-mapping'), {
            domainName: domain,
            stage: this.deploymentStage,
            restApi: this,
            basePath: this._id
        })
    }

    addAuthorizedRole(stack: DeployStack, roleArn: string): PolicyStatement {
        const policyStatement = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['execute-api:Invoke']
        })

        const authRole = Role.fromRoleArn(stack, stack.genId('authenticated-role'), roleArn)
        authRole.attachInlinePolicy(new Policy(stack, stack.genId('api-access-policy'), {
            statements: [policyStatement]
        }))
        return policyStatement;
    }

    path(uri: string): IResource {
        const {node} = uri.split('/')
            .filter(path => !!path)
            .reduce((resource, path) => {
                if (!resource.children[path]) {
                    resource.children[path] = {
                        children: {},
                        node: resource.node.addResource(path)
                    }
                }
                return resource.children[path];
            }, this._tree);

        return node
    }
}