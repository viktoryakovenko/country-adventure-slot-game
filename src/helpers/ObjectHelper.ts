const defaultEnsureMessage = "This value was promised to be there.";
export const ensure = <T>(argument: T | undefined | null, message = defaultEnsureMessage): T => {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }
    return argument;
};
