import {TrackEntry} from "@pixi-spine/runtime-4.0";
import {BaseAnimationStateListener} from "app/helpers/spine/BaseAnimationStateListener";

export class CompleteAnimationStateListener extends BaseAnimationStateListener {
    constructor(private readonly fn: (entry: TrackEntry) => void) {
        super();
    }

    complete(entry: TrackEntry): void {
        this.fn(entry);
    }
}
