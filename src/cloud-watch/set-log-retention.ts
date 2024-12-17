import {genStackResourceId, getCurrentStack} from "../cloud-formation";
import {LogGroup, LogRetention, RetentionDays} from 'aws-cdk-lib/aws-logs'
import {RemovalPolicy} from "aws-cdk-lib/core";

export const setLogRetention = (logGroup: LogGroup, retention: RetentionDays): void => {
    new LogRetention(getCurrentStack().stack, genStackResourceId(logGroup.logGroupName, 'retention'), {
        logGroupName: logGroup.logGroupName,
        retention,
        removalPolicy: RemovalPolicy.DESTROY
    });
}