import {ControlExtension} from "app/controls/MainControl";
import BalanceControl from "app/controls/ui/BalanceControl";
import gameModel from "app/model/GameModel";
import {IPointData} from "pixi.js";
import CoinControl from "app/controls/CoinControl";
import {Container} from "@pixi/display";
import {randomPointOnUnitCircle} from "app/helpers/math";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import promiseHelper, {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import gsap from "gsap";
import {inject} from "app/model/injection/InjectDecorator";
import UserModel from "app/model/UserModel";

export class BalanceReplenishmentVisualsExtension implements ControlExtension<BalanceControl> {
    @inject(UserModel)
    private userModel!: UserModel;

    private winnings = 0;
    private tween: GSAPTween | undefined;

    private balanceControl!: BalanceControl;
    init(instance: BalanceControl): void {
        this.balanceControl = instance;
        gameModel.game.signals.ui.balance.showCashReplenishment.add(this.onShowCashReplenishment, this);
    }

    dispose(): void {
        gameModel.game.signals.ui.balance.showCashReplenishment.unload(this);
    }

    private async onShowCashReplenishment(
        cashSources: {position: IPointData, winnings: number}[], resolve?: () => void
    ) {
        await cashSources.map(async (cashSource, index) => {
            const promises = [];
            const coinsCount = this.calculateCoinsCount(cashSource.winnings);
            for (let i = 0; i < coinsCount; i++) {
                const coinControl = new CoinControl();
                this.balanceControl.add(coinControl);

                const startPoint = new Container();
                const randomOffset = randomPointOnUnitCircle().scale(50 + 70 * Math.random());
                const localCoords = startPoint.toLocal(cashSource.position);
                startPoint.position.set(localCoords.x + randomOffset.x, localCoords.y + randomOffset.y);

                promises.push(coinControl.animate(startPoint, this.balanceControl.container));
                await promiseDelay(20 + Math.round(Math.random() * 50), TimeUnit.mls);
            }

            if (index == 0) {
                await Promise.race(promises);
                const totalWinnings = cashSources.length * cashSource.winnings;
                this.animateBalanceLabel({
                    winnings: totalWinnings,
                    duration: 1,
                }).then();
            }

            await Promise.all(promises);
        }).promise().all();

        resolve && resolve();
    }

    private animateBalanceLabel(props: {winnings: number, duration: number}): Promise<void> {
        const balanceSignals = gameModel.game.signals.ui.balance;
        balanceSignals.startBalanceAnimation.emit();
        const resolvablePromise: ResolvablePromise = promiseHelper.getResolvablePromise();
        const winnings = props.winnings;
        this.tween = gsap.to(this, props.duration, {
            winnings,
            onUpdate: this.tick,
            onComplete: () => {
                this.winnings = 0;
                this.clear();
                balanceSignals.balanceChangesDisplayed.emit();
                resolvablePromise.resolve();
            },
            callbackScope: this,
        });
        return resolvablePromise;
    }

    private tick() {
        this.balanceControl.setValue(this.userModel.getCurrentBalance() + this.winnings);
    }

    private clear(): void {
        if (this.tween) {
            this.tween.kill();
        }
    }

    private calculateCoinsCount(winnings: number) : number {
        if (winnings <= 0) {
            return 0;
        } else if (winnings == 1) {
            return 3;
        } else if (winnings < 10) {
            return 10;
        }
        return 20;
    }
}
