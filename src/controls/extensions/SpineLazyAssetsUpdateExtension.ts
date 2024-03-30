import {ControlExtension} from "app/controls/MainControl";
import SpineControl from "app/controls/SpineControl";
import {Assets} from "@pixi/assets";
import SpineLoader from "app/loader/SpineLoader";

export default class SpineLazyAssetsUpdateExtension implements ControlExtension<SpineControl> {
    constructor(
        protected readonly spine: string,
        protected readonly asset: string,
    ) {
    }

    init(instance: SpineControl): void {
        Assets.load(this.asset).then(() => {
            instance.spine.skeleton.data = SpineLoader.updateTextures(this.spine);
            instance.updateSkin();
            instance.spine.skeleton.setToSetupPose();
        });
    }

    dispose(): void { }
}
