/**
 * Creates a function that, when called, returns the elapsed time in milliseconds since the function was created.
 * @function hrDuration
 * @returns {function} - A function that returns the elapsed time in milliseconds.
 */
export const hrDuration = () => {
    // The high-resolution real time at which the function was created
    const startTime: [number, number] = process.hrtime();

    /**
     * Returns the elapsed time in milliseconds since the function was created.
     * @function duration
     * @returns {number} - The elapsed time in milliseconds.
     */
    const onEnd = function duration(): number {
        // The high-resolution real time at which the function was called
        const hrTime:[number, number] = process.hrtime(startTime);
        // Calculate and return the elapsed time in milliseconds
        return hrTime[0] * 1000 + hrTime[1] / 1000000;
    };

    // Attach the start time to the function for reference
    onEnd.time = startTime;

    return onEnd;
};

export default hrDuration