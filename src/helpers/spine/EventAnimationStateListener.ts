import {TrackEntry} from "@pixi-spine/runtime-4.0";
import {BaseAnimationStateListener} from "app/helpers/spine/BaseAnimationStateListener";
import {IEvent} from "@pixi-spine/base";

export class EventAnimationStateListener extends BaseAnimationStateListener {
    constructor(private fn: (trackEntry: TrackEntry, e: IEvent) => void) {
        super();
    }

    event(entry: TrackEntry, event: IEvent) {
        this.fn(entry, event);
    }
}
