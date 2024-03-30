/* eslint-disable @typescript-eslint/no-unused-vars */
import {AnimationStateListener, TrackEntry} from "@pixi-spine/runtime-4.0";
import {IEvent} from "@pixi-spine/base";
import {ITrackEntry} from "pixi-spine";

export abstract class BaseAnimationStateListener implements AnimationStateListener {
    start(entry: TrackEntry): void {}

    interrupt(entry: TrackEntry): void {}

    end(entry: TrackEntry): void {}

    dispose(entry: TrackEntry): void {}

    complete(entry: ITrackEntry): void {}

    event(entry: ITrackEntry, event: IEvent): void {}
}
