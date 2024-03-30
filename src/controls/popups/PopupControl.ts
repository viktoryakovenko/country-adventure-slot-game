import {TypingSpineControl} from "app/controls/SpineControl";
import {VisibilitySignals} from "app/model/GameSignals";
import WinCounter from "app/pixi/effects/WinCounter";
import {BitmapText} from "@pixi/text-bitmap";
import usablePromises from "app/helpers/promise/UsablePromises";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import {SpeedFactorControl} from "app/controls/extensions/SpeedFactorExtension";

export type TPopupAnimations = "show" | "hide" | "idle" | "win" | "dim" | "undim";
export type TPopupSkins = "intro" | "outro" | "win_counter" | "low_win_counter";

export type PopupOptions = {
    skin: TPopupSkins,
    counterValue: number,
    popupSignal: VisibilitySignals<number>,
    time?: number,
};

export class PopupControlFactory {
    static getPopup(options: PopupOptions): PopupControl {
        const {skin, counterValue, popupSignal} = options;
        const useCurrency = skin !== "intro";
        const useDecimals = skin !== "intro";
        const time = options.time ?? (skin == "low_win_counter" ? 0.5 : 1.25);
        const font = skin == "low_win_counter" ? "win_counter" : skin;
        const popupControl = new PopupControl(useCurrency, useDecimals, time, font);
        popupControl.setSkin(skin);
        popupControl.setCounterValue(counterValue);
        const listener = async (v: void, resolve?: () => void) => {
            await popupControl.hide();
            popupSignal.hide.unload(this);
            popupSignal.hidden.emit();
            resolve?.();
        };
        popupSignal.hide.add(listener, this);
        return popupControl;
    }
}

class PopupControl extends TypingSpineControl<TPopupAnimations, TPopupSkins> implements SpeedFactorControl {
    protected counterValue = -1;
    protected label!: BitmapText;
    protected readonly winCounter: WinCounter;
    speedFactor = 1;

    updateSpeedFactor(speedFactor: number): void {
        this.speedFactor = speedFactor;
    }

    constructor(useCurrency: boolean, useDecimals: boolean, protected readonly time: number = 1.25, font: string) {
        super("fs_intro_popup");
        this.label = new BitmapText("", {fontName: font, fontSize: 62});
        this.winCounter = new WinCounter(this.label, useCurrency, useDecimals);
    }

    init() {
        super.init();
        this.replace("counter", this.label);
        this.label.anchor.set(0.5, 0.5);
    }

    async hide(): Promise<this> {
        await this.play("hide", {timeScale: 1});
        return super.hide();
    }

    async show(): Promise<this> {
        const superPromise = super.show();
        this.label.text = `${this.counterValue}`;
        const timeScale = (this.getAnimationDuration("show") / this.time) * this.speedFactor;
        const clickOnStagePromise = usablePromises.getClickOnStagePromise();
        let isShown = false;
        clickOnStagePromise.then(() => {
            if (isShown) {
                return;
            }
            const current = this.spine.state.getCurrent(0);
            if (current) {
                current.timeScale = 5;
            }
        });
        await [
            this.play("show", {timeScale: timeScale}),
            this.winCounter.animate(this.counterValue, this.time / this.speedFactor, clickOnStagePromise),
        ].promise().all();
        isShown = true;
        clickOnStagePromise.resolve(new Event("click"));
        this.play("idle", {loop: true});
        if (this.speedFactor !== 1) {
            await promiseDelay(0.3, TimeUnit.sec);
        }
        return superPromise;
    }

    setCounterValue(counterValue: number) {
        this.counterValue = counterValue;
    }
}
