import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Output} from "./Output";
import DeployStack from "./DeployStack";
import IDomainConfig from "./IDomainConfig";

export class ApiCertificate extends Certificate {
    hostedZone: IHostedZone
    domain: string

    constructor(stack: DeployStack, id: string, domain: IDomainConfig) {
        const certDomain = [domain.domainName]
        if (domain.subdomain) certDomain.splice(0, 0, domain.subdomain)
        const domainName = certDomain.join('.')

        console.log('Getting Hosted Zone', domain.hostedZone.name)
        const hostedZone: IHostedZone = HostedZone.fromHostedZoneAttributes(stack, stack.genId(id, 'hosted-zone'), {
            hostedZoneId: domain.hostedZone.id,
            zoneName: domain.hostedZone.name
        })
        console.log('Defining Certificate For', domainName)
        super(stack, stack.genId(id), {
            domainName,
            validation: CertificateValidation.fromDns(hostedZone)
        });

        this.domain = domainName
        new Output(stack, id, this.certificateArn)
        this.hostedZone = hostedZone
    }
}
export default ApiCertificate