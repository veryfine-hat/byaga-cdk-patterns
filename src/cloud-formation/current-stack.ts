import type {DeployStack} from "./DeployStack";

let currentStack: DeployStack<never>;

/**
 * Helpful method to get the 'current' stack that is being defined.  Hopefully this will reduce the need to pass the stack around everywhere.
 */
export function getCurrentStack<T>() {
    return currentStack as DeployStack<T>;
}

/**
 * This sets the 'current' stack.  This should be automatic everywhere, but in case something goes wrong here is a way to force the issue
 * @param stack
 */
export function setCurrentStack<T>(stack: DeployStack<T>) {
    currentStack = stack as DeployStack<never>;
    return stack;
}