import MainControl from "./../MainControl";
import Signal from "app/helpers/signals/signal/Signal";
import {SpriteControl} from "app/controls/SpriteControl";
import {IButtonControl} from "app/controls/button/ButtonControl";

export default class SpriteSheetButtonControl extends MainControl implements IButtonControl<SpriteSheetButtonControl> {
    public readonly onClick: Signal<SpriteSheetButtonControl> = new Signal<SpriteSheetButtonControl>();
    private readonly button: SpriteControl;
    public readonly hover: string;
    public readonly texture: string;
    public readonly disableTexture: string;

    constructor(texture: string, options?: Partial<{hover: string, disable:string}>) {
        super();
        this.texture = texture;
        this.disableTexture = options?.disable ?? texture.replace(/(\.[^.]+)$/, "_disable$1");
        this.hover = options?.hover ?? texture.replace(/(\.[^.]+)$/, "_hov$1");
        this.button = new SpriteControl(texture);
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
        this.setPivotTo(this.button.container);
    }

    init() {
        super.init();
        this.add(this.button);
        this.container.on("pointerover", () => {
            this.onOver();
        });
        this.container.on("pointerout", () => {
            this.onOut();
        });
        this.container.on("pointerdown", () => {
            this.onClicked();
            this.onOut();
        });
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
    }

    dispose(): void {
        this.container.removeChildren();
        this.container.off("pointerdown");
        this.container.off("pointerout");
        this.container.off("pointerover");
        super.dispose();
    }

    isEnable() {
        return this.button.texture !== this.disableTexture;
    }

    enable() {
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
        this.button.texture = this.texture;
    }

    disable() {
        if (this.isEnable()) {
            this.container.eventMode = "none";
            this.container.cursor = "default";
            this.button.texture = this.disableTexture;
        }
    }

    protected onClicked() {
        if (this.isEnable()) {
            this.onClick.emit(this);
        }
    }

    protected onOut() {
        this.button.texture = this.texture;
    }

    protected onOver() {
        this.button.texture = this.hover;
    }
}
