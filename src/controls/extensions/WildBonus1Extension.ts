import ReelsControl from "app/controls/reels/ReelsControl";
import {ControlExtension} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {TJumpingWild} from "app/server/service/typing";
import {inject} from "app/model/injection/InjectDecorator";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import SpineControl from "../SpineControl";
import usablePromises from "app/helpers/promise/UsablePromises";

export default class WildBonus1Extension implements ControlExtension<ReelsControl> {
    private readonly wildBonusConfig = {
        spineId: "wildbonus1",
        animationId: "jump",
        animationDuration: 1,
    };

    @inject(MotionLayerControl)
    private readonly motionLayer!: MotionLayerControl;

    private wildBonusControl! : SpineControl;
    private reelsControl!: ReelsControl;

    init(instance: ReelsControl): void {
        this.reelsControl = instance;
        gameModel.game.signals.reels.showWildBonus1Presentation.add(this.onShowWildBonus1Wins, this);
    }

    dispose(): void {
        gameModel.game.signals.reels.showWildBonus1Presentation.unload(this);
    }

    private async onShowWildBonus1Wins(wildBonusPaths: TJumpingWild[][], resolve?: () => void): Promise<void> {
        await Promise.all(wildBonusPaths.map(async wildBonusPath => {
            this.wildBonusControl = new SpineControl(this.wildBonusConfig.spineId);
            this.motionLayer.add(this.wildBonusControl);
            await this.moveAlongPath(this.reelsControl, wildBonusPath);
            this.wildBonusControl.removeFromParent();
        }));
        resolve && resolve();
    }

    private async moveAlongPath(reelsControl: ReelsControl, wildBonusPath: TJumpingWild[]) : Promise<void> {
        const breakPromise = usablePromises.getClickOnStagePromise();
        this.reelsControl.updateSymbol(wildBonusPath[0].jumpFrom, wildBonusPath[0].replaceOn);

        for (const jump of wildBonusPath) {
            const fromSymbol = reelsControl.getSymbol(jump.jumpFrom).container;
            const toSymbol = reelsControl.getSymbol(jump.jumpTo).container;

            const movePromise = this.motionLayer.move({
                from: fromSymbol,
                to: toSymbol,
                duration: this.wildBonusConfig.animationDuration,
                what: this.wildBonusControl.container,
                fitToSize: false,
                breakPromise: breakPromise,
            });

            this.wildBonusControl.playInTime(this.wildBonusConfig.animationId, this.wildBonusConfig.animationDuration);
            this.lookAt(jump);
            await Promise.race([breakPromise, movePromise]);
            this.reelsControl.updateSymbol(jump.jumpTo, jump.replaceOn);
        }
    }

    private lookAt(jump: TJumpingWild) {
        this.wildBonusControl.setScale({x: jump.jumpFrom.x > jump.jumpTo.x ? -1 : 1, y: 1});
    }
}
