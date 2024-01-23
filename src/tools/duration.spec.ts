import {hrDuration} from './duration';

it('returns a function that returns elapsed time', () => {
    const duration = hrDuration();
    const elapsedTime = duration();

    expect(typeof duration).toBe('function');
    expect(typeof elapsedTime).toBe('number');
});