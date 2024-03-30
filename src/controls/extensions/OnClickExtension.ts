import MainControl, {ControlExtension} from "app/controls/MainControl";

export default class OnClickExtension implements ControlExtension {
    constructor(protected readonly listener: () => void) {
    }

    init(instance: MainControl): void {
        const container = instance.container;
        container.eventMode = "static";
        container.cursor = "pointer";
        container.on("pointerdown", this.listener, container);
    }

    dispose(instance: MainControl): void {
        const container = instance.container;
        container.eventMode = "auto";
        container.cursor = "default";
        container.off("pointerdown", this.listener, container);
    }
}
