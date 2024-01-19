import IHostedZoneConfig from "./IHostedZoneConfig";

export interface IDomainConfig {
    domainName: string,
    subdomain?: string,
    hostedZone: IHostedZoneConfig
}
export default IDomainConfig