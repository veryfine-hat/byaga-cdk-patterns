import {Effect, IGrantable, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {get} from "./parameter-cache";

/**
 * Grants read access to an SSM parameter for a grantee.
 * @param {string} name - The name of the SSM parameter.
 * @param {IGrantable} grantee - The entity to be granted read access.
 */
export function grantRead(name: string, grantee: IGrantable) {
    // Retrieve the SSM parameter from the cache
    const grantor = get(name);

    // Add a policy to the grantee's principal that allows 'ssm:GetParameter' action on the SSM parameter
    grantee.grantPrincipal.addToPrincipalPolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['ssm:GetParameter'],
        resources: [grantor.parameterArn]
    }));

    // If the SSM parameter is encrypted with a key, grant the grantee decrypt permissions on the key
    if (grantor.decryptWithKey) grantor.decryptWithKey.grantDecrypt(grantee);
}