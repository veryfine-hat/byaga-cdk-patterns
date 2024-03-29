import {Stack} from 'aws-cdk-lib';
import IStackArguments from './IStackArguments'
import {IConstruct} from "constructs";

export class DeployStack extends Stack {
    registry: { [t: string]: { [n: string]: any } } = {}
    stage: string
    name: string
    project: string

    genName(...name: string[]): string {
        return DeployStack.genStackResourceName(this.name, name.filter(n => !!n).join('-'), this.stage)
    }

    genStackName(stackName: string, ...name: string[]): string {
        return DeployStack.genStackResourceName(stackName, name.filter(n => !!n).join('-'), this.stage)
    }

    genId(...name: string[]): string {
        return DeployStack.genStackResourceId(this.name, name.filter(n => !!n).join('-'), this.stage)
    }

    genStackId(stackName: string, ...name: string[]): string {
        return DeployStack.genStackResourceId(stackName, name.filter(n => !!n).join('-'), this.stage)
    }

    static genStackResourceName(stackName: string, resource: string, stage = 'develop') {
        let name = stackName[0].toLowerCase() + stackName.substring(1)
        name = name.replace(/[A-Z]/g, v => '-' + v.toLowerCase())
        return `${name}-${stage}-${resource}`.toLowerCase()
    }

    static genStackResourceId(stackName: string, resource: string, stage = 'develop') {
        const constructName = `${stackName}-${stage}-${resource}`
        return constructName[0].toUpperCase() + constructName.substring(1).replace(/-./g, v => (v[1] || '').toUpperCase())
    }

    constructor(scope: IConstruct, props: IStackArguments) {
        const options = (props || {}) as IStackArguments
        const {stage = 'develop'} = options
        super(scope, props.stackName + '-' + stage, {
            ...props,
            stackName: props.stackName + '-' + stage
        });
        const stack = this;
        stack.name = props.stackName || '';

        stack.stage = stage;
        stack.project = props.project;

        stack.tags.setTag('stage', stage);
        stack.tags.setTag('stack', this.genName('ui-stack'));
        stack.tags.setTag('project', props.project);
        stack.tags.setTag('owner', props.owner);
    }

    get(type: string, name: string) {
        const items = this.registry[type]
        return (items && items[name]) || null
    }

    set(type: string, name: string, instance: any) {
        this.registry[type] = this.registry[type] || {};
        this.registry[type][name] = instance;
        return instance;
    }
}
export default DeployStack