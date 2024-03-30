import {CompleteAnimationStateListener} from "app/helpers/spine/CompleteAnimationStateListener";
import {EventAnimationStateListener} from "app/helpers/spine/EventAnimationStateListener";
import {TrackEntry} from "@pixi-spine/runtime-4.0";
import {AnimationEndStateListener} from "app/helpers/spine/AnimationEndStateListener";
import {IEvent} from "@pixi-spine/base";

// noinspection JSUnusedGlobalSymbols
export default new class SpineStateListenerFactory {
    complete(fn: (entry: TrackEntry) => void) {
        return new CompleteAnimationStateListener(fn);
    }

    event(fn: (ctx: TrackEntry, e: IEvent) => void) {
        return new EventAnimationStateListener(fn);
    }

    end(fn: (entry: TrackEntry) => void) {
        return new AnimationEndStateListener(fn);
    }
}();

