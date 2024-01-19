import {CfnOutput, RemovalPolicy} from 'aws-cdk-lib';
import {Table, BillingMode, AttributeType} from 'aws-cdk-lib/aws-dynamodb'
import {Effect, Policy, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {DeployStack} from "./DeployStack"

interface DynamoDbTableConfig {
    partitionKey: string,
    sortKey?: string
}

export class DynamoDbTable extends Table {
    getPolicy: Policy

    constructor(stack: DeployStack, id: string, props: DynamoDbTableConfig) {
        console.log('Creating DynamoDb Table', stack.genName(id, 'data-table'))
        super(stack, stack.genId(id, 'data-table'), {
            tableName: stack.genName(id, 'data-table'),
            partitionKey: {name: props.partitionKey, type: AttributeType.STRING},
            sortKey: props.sortKey ? {name: props.sortKey, type: AttributeType.STRING} : undefined,
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY
        });
    stack.set('dynamo', id, this)

        new CfnOutput(stack, stack.genId(id, 'table'), {
            value: this.tableName,
            exportName: stack.genName(id, 'table')
        })

        this.getPolicy = new Policy(stack, stack.genId(id, 'get-policy'), {
            statements: [
                new PolicyStatement({
                    actions: ['dynamodb:GetItem'],
                    effect: Effect.ALLOW,
                    resources: [this.tableArn]
                })
            ]
        })
    }
}
