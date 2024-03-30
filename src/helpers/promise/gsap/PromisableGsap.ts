// eslint-disable-next-line import/no-named-as-default
import gsap from "gsap";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";

export type BreakPromise = {
    breakPromise?: ResolvablePromise<unknown>;
};

class PromisableGsap {
    // eslint-disable-next-line
    to(target: GSAPTweenTarget, prop: GSAPTweenVars & BreakPromise): Promise<any> {
        const breakPromise = prop.breakPromise ? prop.breakPromise : promiseHelper.getResolvablePromise();
        if (breakPromise.resolved) {
            return Promise.resolve();
        }
        delete prop.breakPromise;
        return new Promise(resolve => {
            const tween = gsap.to(target, {
                duration: 0.75,
                ...prop,
                onComplete: resolve,
            });
            breakPromise.then(() => {
                tween.kill();
            });
        });
    }
}

const pgsap = new PromisableGsap();
export default pgsap;
