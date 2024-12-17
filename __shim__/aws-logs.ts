import type {IConstruct} from "constructs";

type LogRetentionProps = object

export class LogRetention {
    logRetentionArn: string
    constructor(scope: IConstruct, id: string, props: LogRetentionProps) {
        this.logRetentionArn = id + JSON.stringify(props)
    }
}

interface LogGroupProps {
    logGroupName?: string
    retention?: RetentionDays
}

export class LogGroup {
    logGroupName: string
    constructor(scope: IConstruct, id: string, props: LogGroupProps) {
        this.logGroupName = id + props.logGroupName
    }
}

export class RetentionDays {
    static readonly ONE_WEEK = new RetentionDays()
}