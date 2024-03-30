import {Container} from "@pixi/display";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import {Main} from "app/Main";
import {TimeUnit} from "app/helpers/TimeHelper";

export class UsablePromises {
    getTimeoutOrClickOnStagePromise(milliseconds: number) {
        const timeoutPromise = TimeUnit.mls.await(milliseconds);
        const clickPromise = this.getClickOnStagePromise();

        return Promise.race([timeoutPromise, clickPromise]);
    }

    getClickOnStagePromise() {
        return this.getClickPromise(Main.APP.stage);
    }

    getClickPromise(container: Container): ResolvablePromise<Event> {
        const promise: ResolvablePromise<Event> = promiseHelper.getResolvablePromise();
        container.eventMode = "static";
        container.once("pointerdown", promise.resolve, this);
        promise.then(() => {
            container.eventMode = "auto";
        });
        return promise;
    }
}

const usablePromises = new UsablePromises();
export default usablePromises;
