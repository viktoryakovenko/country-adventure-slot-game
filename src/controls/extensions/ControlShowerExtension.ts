/* eslint-disable @typescript-eslint/no-explicit-any */
import MainControl, {ControlExtension} from "app/controls/MainControl";
import DisplayObjectHelper from "app/helpers/DisplayObjectHelper";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import {IButtonControl} from "app/controls/button/ButtonControl";
import {DisplayObject} from "@pixi/display";
import {FederatedPointerEvent} from "@pixi/events";
import {ensure} from "app/helpers/ObjectHelper";

export default class ControlShowerExtension implements ControlExtension<MainControl & IButtonControl<any>> {
    constructor(private controlToShow: MainControl) {

    }

    init(instance: MainControl & IButtonControl<any>): void {
        instance.onClick.add(async () => {
            if (this.controlToShow.container.visible) {
                await this.controlToShow.hide();
            } else {
                this.addOutsideControlClickHandler(this.controlToShow, instance);
                await this.controlToShow.show();
            }
        });
    }

    dispose(instance: IButtonControl<any>): void {
        instance.onClick.unload(this);
    }

    private addOutsideControlClickHandler(control: MainControl, ignoreControl: MainControl) {
        const type = "pointerdown";
        const container = control.container;
        let currentTarget: DisplayObject | undefined;
        const onClose = async () => {
            document.body.removeEventListener(type, onClose);
            control.container.off(type, clickHandler, this);
            const isVisible = container.visible && container.alpha == 1;
            if (!currentTarget) {
                if (isVisible) {
                    await control.hide();
                }
                return;
            }
            const child = ensure(currentTarget);
            currentTarget = undefined;
            const isOurContainer = DisplayObjectHelper.isChildOff(child, container);
            const isIgnoreContainer = DisplayObjectHelper.isChildOff(child, ignoreControl.container);
            if (!isOurContainer || isIgnoreContainer) {
                if (isVisible) {
                    await control.hide();
                }
            } else if (isVisible) {
                document.body.addEventListener(type, onClose);
                control.container.on(type, clickHandler, this);
                control.container.eventMode = "static";
                control.container.cursor = "pointer";
            }
        };
        const clickHandler = async (e: FederatedPointerEvent) => {
            currentTarget = <DisplayObject>e.target;
        };
        promiseDelay(1, TimeUnit.mls).then(() => {
            document.body.addEventListener(type, onClose);
            control.container.on(type, clickHandler, this);
            control.container.eventMode = "static";
            control.container.cursor = "pointer";
        });
    }
}
