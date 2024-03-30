import ReelsControl from "app/controls/reels/ReelsControl";
import {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {TJumpingWild, TSymbolId, TSymbolPosition} from "app/server/service/typing";
import {inject} from "app/model/injection/InjectDecorator";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import SpineControl from "../SpineControl";
import usablePromises from "app/helpers/promise/UsablePromises";
import {Container} from "@pixi/display";

export default class WildBonus2Extension implements ControlExtension<ReelsControl> {
    @inject(MotionLayerControl)
    private readonly motionLayer!: MotionLayerControl;
    private readonly jumpDuration = 1.0;
    private readonly flyAwayDuration = 1.5;
    private readonly wildBonusSkin = "robin";
    private readonly wildBonusFlyAwayTarget = new Container();
    private readonly flyAwayTargetPositionY = -100;
    private reelsControl!: ReelsControl;

    init(instance: ReelsControl): void {
        this.reelsControl = instance;
        gameModel.game.signals.reels.showWildBonus2Presentation
            .add(this.onShowWildBonus2Animation, this);
    }

    dispose(): void {
        this.wildBonusFlyAwayTarget.destroy();
        gameModel.game.signals.reels.showWildBonus2Presentation.unload(this);
    }

    private addReturnJump(jumps: TJumpingWild[]) : TJumpingWild[] {
        const result = [...jumps];
        jumps.push({
            jumpFrom: jumps[jumps.length - 1].jumpTo,
            jumpTo: jumps[0].jumpFrom,
            replaceOn: TSymbolId.WILD,
        });
        return result;
    }

    private createJumpingWild(): SpineControl {
        const jumpingWild = new SpineControl("wildbonus2");
        jumpingWild.setSkin(this.wildBonusSkin);
        return jumpingWild;
    }

    private async onShowWildBonus2Animation(
        allJumps: TJumpingWild[][],
        resolve?: () => void): Promise<void> {
        allJumps.forEach(jumps => this.addReturnJump(jumps));
        await allJumps.map(async jumps => {
            const jumpingWild = this.createJumpingWild();
            this.motionLayer.add(jumpingWild);
            await this.moveJumpingWild(jumps, jumpingWild);
            await this.flyAway(jumps[jumps.length - 1].jumpTo, jumpingWild);
            jumpingWild.removeFromParent();
        }).promise().all();

        resolve && resolve();
    }

    private async moveJumpingWild(
        jumps: TJumpingWild[],
        jumpingWild: SpineControl) : Promise<void> {
        const breakPromise = usablePromises.getClickOnStagePromise();
        for (const jump of jumps) {
            const fromSymbol = this.reelsControl.getSymbol(jump.jumpFrom).container;
            const toSymbol = this.reelsControl.getSymbol(jump.jumpTo).container;
            const movePromise = this.motionLayer.move({
                from: fromSymbol,
                to: toSymbol,
                duration: this.jumpDuration,
                what: jumpingWild.container,
                fitToSize: false,
                breakPromise: breakPromise,
            });
            jumpingWild.playInTime("jump", this.jumpDuration);
            jumpingWild.setScale({x: this.getXScale(jump.jumpFrom, jump.jumpTo), y: 1});
            await Promise.race([breakPromise, movePromise]);
            this.reelsControl.updateSymbol(jump.jumpTo, jump.replaceOn);
        }
    }

    private getXScale(jumpFrom : TSymbolPosition, jumpTo: TSymbolPosition) : number {
        return (jumpFrom.x > jumpTo.x ? -1 : 1);
    }

    private async flyAway(
        lastPosition: TSymbolPosition,
        jumpingWild: SpineControl) : Promise<void> {
        this.updateFlyAwayTargetPosition();
        const fromSymbol = this.reelsControl.getSymbol(lastPosition).container;
        const flyAwayPromise = this.motionLayer.move({
            from: fromSymbol,
            to: this.wildBonusFlyAwayTarget,
            duration: this.flyAwayDuration,
            what: jumpingWild.container,
            fitToSize: false,
        });
        jumpingWild.setScale(
            {x: this.getXScale(fromSymbol.getGlobalPosition(), this.wildBonusFlyAwayTarget.position), y: 1}
        );
        jumpingWild.play("flight", {loop: true});
        await flyAwayPromise;
    }

    private updateFlyAwayTargetPosition() {
        const newX = gameModel.gameSize.width / 2;
        this.wildBonusFlyAwayTarget.position.set(newX, this.flyAwayTargetPositionY);
    }
}
