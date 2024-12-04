import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {getCurrentStack, genId, output} from "../cloud-formation";
import IDomainConfig from "./IDomainConfig";

export interface CertificateDetails {
    domain: string,
    hostedZone: IHostedZone,
    certificate: Certificate
}

export function apiCertificate(id: string, domain: IDomainConfig) {
    console.log('Defining HTTPS Certificate', id + '-certificate')
    const {stack} = getCurrentStack()
    const certDomain = [domain.domainName]
    if (domain.subdomain) certDomain.splice(0, 0, domain.subdomain)
    const domainName = certDomain.join('.')

    console.log('Getting Hosted Zone', domain.hostedZone.name)
    const hostedZone: IHostedZone = HostedZone.fromHostedZoneAttributes(stack, genId(id, 'hosted-zone'), {
        hostedZoneId: domain.hostedZone.id,
        zoneName: domain.hostedZone.name
    })
    console.log('Defining Certificate For', domainName)
    const certificate = new Certificate(stack, genId(id), {
        domainName,
        validation: CertificateValidation.fromDns(hostedZone)
    });

    output(id, certificate.certificateArn)
    return {
        domain: domainName,
        hostedZone,
        certificate
    }
}