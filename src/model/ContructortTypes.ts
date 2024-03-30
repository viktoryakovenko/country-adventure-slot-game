/* eslint-disable @typescript-eslint/no-explicit-any */
declare type constructor<T> = {
    new (...args: any[]): T;
};
export default constructor;
