import MainControl from "app/controls/MainControl";
import SpineLoader from "app/loader/SpineLoader";
import {Spine} from "@pixi-spine/runtime-4.0";
import {Ticker} from "@pixi/ticker";
import {inject} from "app/model/injection/InjectDecorator";
import SpineStateListenerFactory from "app/helpers/spine/SpineStateListenerFactory";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import SpineHelper from "app/helpers/spine/SpineHelper";
import {Container} from "@pixi/display";
import Signal from "app/helpers/signals/signal/Signal";
import {IEvent} from "@pixi-spine/base";
import {ensure} from "app/helpers/ObjectHelper";

export type SpinePlayConfig = {
    trackIndex: number,
    loop: boolean,
    frameAt: number,
    loopsLimit: number,
    timeScale: number,
    event: Signal<IEvent>,
    overrideAnimation: boolean
};
export default class SpineControl extends MainControl {
    public readonly spine: Spine;
    @inject(Ticker)
    public ticker!: Ticker;
    private playPromises: Map<number, ResolvablePromise<void>> = new Map();
    private lastTrackAnimation: Map<number, string> = new Map();
    public resetSpineOnReSkin = false;

    constructor(spineKey: string) {
        super(SpineLoader.getSpine(spineKey));
        this.spine = <Spine> this.container;
        this.spine.autoUpdate = true;
    }

    getSkin(): string {
        return this.spine.skeleton.skin.name;
    }

    updateSkin() {
        this.setSkin(this.spine.skeleton.skin.name);
    }

    setSkin(name: string) {
        this.spine.skeleton.setSkinByName(name);
        if (this.resetSpineOnReSkin) {
            this.spine.skeleton.setToSetupPose();
        }
    }

    stop() {
        return {
            track: (track: number) => {
                this.spine.state.clearTrack(track);
            },
            name: (name: string) => {
                this.spine.state.tracks
                    .filter(value => value != null)
                    .filter(value => value.animation.name == name)
                    .forEach(value => {
                        this.spine.state.clearTrack(value.trackIndex);
                    });
            },
        };
    }

    getCurrentAnimation(trackIndex: number) {
        return this.lastTrackAnimation.get(trackIndex);
    }

    playInTime(animationId : string, duration: number) {
        const timeScale = this.getAnimationData(animationId).duration / duration;
        return this.play(animationId, {timeScale: timeScale});
    }

    play(name: string, data?: Partial<SpinePlayConfig>) {
        data = data ?? {};
        const trackIndex = data?.trackIndex ?? 0;
        const loop = data?.loop ?? false;
        data.timeScale = data?.timeScale ?? 1;
        data.frameAt = data?.frameAt ?? -1;
        const overrideAnimation = data.overrideAnimation ?? true;
        const playPromises = this.playPromises;
        const lastTrackAnimation = this.lastTrackAnimation;
        const promise = playPromises.get(trackIndex) ?? promiseHelper.getResolvablePromise();
        if (!overrideAnimation && lastTrackAnimation.get(trackIndex) == name && playPromises.has(trackIndex)) {
            return ensure(playPromises.get(trackIndex));
        }
        lastTrackAnimation.set(trackIndex, name);
        promise.resolve();
        let loopsLimit = data?.loopsLimit ?? -1;
        const resolvablePromise = promiseHelper.getResolvablePromise<void>();
        playPromises.set(trackIndex, resolvablePromise);
        const trackEntry = this.spine.state.setAnimation(
            trackIndex, name, loop
        );
        if (data.frameAt >= 0 && data.frameAt <= 1) {
            const frameAt = Math.min(Math.max(0.01, data.frameAt), 0.999999);
            const time = this.getAnimationDuration(name) * frameAt;
            trackEntry.trackTime = time;
            trackEntry.timeScale = 0.000001;
            resolvablePromise.resolve();
        } else {
            trackEntry.timeScale = data.timeScale;
        }
        // console.log(`Animation[${this.uid}] ${name} start, loop(${data?.loop})`)
        trackEntry.listener = SpineStateListenerFactory.complete(() => {
            if (loopsLimit-- < 0) {
                this.ticker?.remove(this.update, this);
                resolvablePromise.resolve();
                if (!loop) {
                    this.spine.state.clearTrack(trackIndex);
                }
                // console.log(`Animation[${this.uid}] ${name} end, loop(${data?.loop})`)
            }
        });
        trackEntry.listener.event = (entry, event) => {
            data?.event?.emit(event);
        };
        this.ticker.remove(this.update, this);
        this.ticker.add(this.update, this);
        return resolvablePromise;
    }

    getAnimations() {
        return this.spine.spineData.animations.map(value => {
            return value.name;
        });
    }

    protected update(dt: number) {
        if (!this.spine.autoUpdate) {
            this.spine.update(((1000 / 60) / 1000) * dt);
        }
    }

    public replace(name: string, displayObject: Container, copySlotsData = false): void {
        SpineHelper.replaceInSlotContainer(this, name, displayObject, copySlotsData);
    }

    public getSlotContainer(name: string) {
        return SpineHelper.getSlotContainer(this, name);
    }

    public replaceTo(parent: SpineControl, name: string): void {
        SpineHelper.replaceInSlotContainer(parent, name, this.container);
    }

    public addToSlot(name: string, displayObject: Container): void {
        SpineHelper.addToSlotContainer(this, name, displayObject);
    }

    protected getAnimationDuration(animation: string) {
        const animationData = this.getAnimationData(animation);
        if (!animationData) {
            console.warn("no data for animation: ", animation);
        }
        return animationData.duration;
    }

    dispose() {
        this.ticker && this.ticker.remove(this.update, this);
        super.dispose();
    }

    getAnimationData(animation: string) {
        return this.spine.spineData.findAnimation(animation);
    }
}

export class TypingSpineControl<Animations extends string, Skins extends string> extends SpineControl {
    setSkin(name: Skins) {
        super.setSkin(name);
    }

    getSkin(): Skins {
        return <Skins> super.getSkin();
    }

    getCurrentAnimation(trackIndex: number):Animations {
        return <Animations> super.getCurrentAnimation(trackIndex);
    }

    play(name: Animations, data?: Partial<SpinePlayConfig>): ResolvablePromise<void> {
        return super.play(name, data);
    }
}
