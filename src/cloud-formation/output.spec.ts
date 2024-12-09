import { output } from './output';
import {getCurrentStack} from "./current-stack";

jest.unmock('./output')

beforeEach(() => {
    (getCurrentStack as jest.Mock).mockReturnValue({stack: 'mockedStack'});
})

it('creates a CfnOutput with the correct parameters', () => {
    const result = output('testName', 'testValue');
    expect(result.value).toBe('testValue');
    expect(result.exportName).toBe('name:stack-stage:testName');
});

it('handles empty name and value', () => {
    const result = output('', '');
    expect(result.value).toBe('');
    expect(result.exportName).toBe('name:stack-stage:');
});

it('handles special characters in name and value', () => {
    const result = output('name!@#$', 'value!@#$');
    expect(result.value).toBe('value!@#$');
    expect(result.exportName).toBe('name:stack-stage:name!@#$');
});