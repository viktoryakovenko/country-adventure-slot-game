import SpineControl from "app/controls/SpineControl";

export default class GrassControl extends SpineControl {
    constructor() {
        super("grass");
    }

    init(): void {
        super.init();
        this.play("animation", {loop: true});
    }

    dispose(): void {
    }
}
