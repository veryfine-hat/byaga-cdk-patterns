export enum Effect {
    ALLOW
}

export interface IPrincipal {
    addToPrincipalPolicy(policyStatement: PolicyStatement): void
}

export interface IGrantable {
    grantPrincipal: IPrincipal
}

export class PolicyStatement {
    policyDocument: PolicyDocument
    constructor(policyDocument: PolicyDocument) {
        this.policyDocument = policyDocument
    }
}

export  type PolicyDocument = object