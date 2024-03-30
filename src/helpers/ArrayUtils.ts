export default class ArrayUtils {
    static remove<T>(arr:Array<T>, o:T) {
        while (arr.indexOf(o) >= 0) {
            const indexOf = arr.indexOf(o);
            arr.splice(indexOf, 1);
        }
    }
}
