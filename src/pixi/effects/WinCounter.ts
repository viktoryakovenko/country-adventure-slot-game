/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import CurrencyFormatter from "app/game/CurrencyFormatter";

// noinspection JSUnusedGlobalSymbols
export default class WinCounter {
    private readonly winCounterLabel: {text: string};
    private totalWinnings = 0;
    private winnings = 0;
    private readonly useDecimals: boolean;
    private readonly useCurrency: boolean;
    private tween: GSAPTween | undefined;

    private readonly currencyFormatter: CurrencyFormatter = new CurrencyFormatter();
    private onUpdateCallbackF: (() => void) | undefined;

    constructor(winCounterLabel: {text: string}, useCurrency: boolean, useDecimals: boolean) {
        this.winCounterLabel = winCounterLabel;
        this.useCurrency = useCurrency;
        this.useDecimals = useDecimals;
    }

    public animate(winnings: number, time: number, breakPromise?: Promise<any>): Promise<void> {
        this.totalWinnings = Math.round(winnings);
        const resolvablePromise: ResolvablePromise<void> = promiseHelper.getResolvablePromise();
        this.tween = gsap.to(this, time, {
            winnings,
            onUpdate: this.update,
            onComplete: () => {
                this.clear();
                resolvablePromise.resolve();
            },
            callbackScope: this,
        });
        if (breakPromise) {
            breakPromise.then(() => {
                this.clear();
                resolvablePromise.resolve();
                this.winnings = winnings;
                this.update();
            });
        }
        return resolvablePromise;
    }

    public setValue(winnings: number) {
        this.winnings = this.totalWinnings = winnings;
        this.update();
    }

    private update() {
        if (this.useDecimals) {
            this.updateAmount(this.winnings, true);
        } else {
            const amount = this.useCurrency ? Math.round(this.winnings / 100) * 100 : Math.round(this.winnings);
            this.updateAmount(amount, false);
        }
        this.onUpdateCallbackF && this.onUpdateCallbackF();
    }

    private updateAmount(value: number, useDecimals: boolean) {
        this.winCounterLabel.text = this.useCurrency ? this.calculateValue(value, useDecimals) : value.toString();
    }

    private calculateValue(value: number, useDecimals: boolean): string {
        return this.currencyFormatter.formatAmount(value, useDecimals, true);
    }

    private clear(): void {
        if (this.tween) {
            this.tween.kill();
        }
    }

    onUpdate(callbackF: () => void) {
        this.onUpdateCallbackF = callbackF;
    }
}


