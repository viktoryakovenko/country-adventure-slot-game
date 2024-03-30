import {TrackEntry} from "@pixi-spine/runtime-4.0";
import {BaseAnimationStateListener} from "app/helpers/spine/BaseAnimationStateListener";

export class AnimationEndStateListener extends BaseAnimationStateListener {
    constructor(private readonly endListener:(entry: TrackEntry)=>void) {
        super();
    }
    end(entry: TrackEntry) {
        this.endListener(entry);
    }
}
