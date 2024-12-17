import type {IGrantable} from "./aws-iam";

export interface IKey {
    grantDecrypt(grantee: IGrantable): void
}