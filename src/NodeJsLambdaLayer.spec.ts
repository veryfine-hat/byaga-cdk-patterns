import { NodeJsLambdaLayer } from './NodeJsLambdaLayer';
import { DeployStack } from './DeployStack';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { buildNodeSource } from './methods/build-node-source';
import duration from './methods/duration';
import {Architecture} from "aws-cdk-lib/aws-lambda";

jest.mock('aws-cdk-lib/aws-lambda');
jest.mock('./methods/build-node-source');
jest.mock('./methods/duration');

class NodeJsLambdaLayerProps {
}

describe('NodeJsLambdaLayer', () => {
    let stack: DeployStack;
    let id: string;
    let props: NodeJsLambdaLayerProps;

    beforeEach(() => {
        jest.clearAllMocks();
        stack = {
            genName: jest.fn(),
            genId: jest.fn(),
            set: jest.fn(),
        } as unknown as DeployStack;
        id = 'id';
        props = {
            compatibleRuntimes: [Runtime.NODEJS_18_X],
            compatibleArchitectures: [Architecture.ARM_64],
        };
        (buildNodeSource as jest.Mock).mockReturnValue('build-dir');
        (duration as jest.Mock).mockReturnValue(() => 1000);
        (Code.fromAsset as jest.Mock).mockReturnValue('code');
    });

    it('constructs a new NodeJsLambdaLayer instance', () => {
        new NodeJsLambdaLayer(stack, id, props);

        expect(buildNodeSource).toHaveBeenCalledWith('lambda-layer', id, { subdirectory: 'nodejs' });
        expect(LayerVersion).toHaveBeenCalledWith(stack, stack.genId(id), expect.any(Object));
        expect(stack.set).toHaveBeenCalledWith('lambda-layer', id, expect.any(NodeJsLambdaLayer));
    });

    it('constructs a new NodeJsLambdaLayer instance without props', () => {
        new NodeJsLambdaLayer(stack, id);

        expect(buildNodeSource).toHaveBeenCalledWith('lambda-layer', id, { subdirectory: 'nodejs' });
        expect(LayerVersion).toHaveBeenCalledWith(stack, stack.genId(id), expect.any(Object));
        expect(stack.set).toHaveBeenCalledWith('lambda-layer', id, expect.any(NodeJsLambdaLayer));
    });
});