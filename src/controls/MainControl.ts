import {BoundsPixiContainer} from "app/helpers/ScaleHelper";
import VisibilityExtension, {VisibilityControl} from "app/controls/extensions/VisibilityExtension";
import Signal from "app/helpers/signals/signal/Signal";
import {Container, DisplayObject} from "@pixi/display";

export default abstract class MainControl implements VisibilityControl {
    public static _UID = 1;
    public readonly uid: number = MainControl._UID++;
    public readonly container: Container;
    private readonly extensions: ControlExtensionContainer<this>[] = [];
    readonly onHide = new Signal<void>();
    readonly onShow = new Signal<void>();

    protected constructor(container?: Container) {
        this.container = container ?? new Container();
        this.container.on("added", this.init, this);
        this.container.on("removed", this.dispose, this);
        this.addExtension(new VisibilityExtension());
    }

    add(control: MainControl): void {
        this.container.addChild(control.container);
    }

    addExtension(extension: ControlExtension<this>, options?: Partial<ExtensionOptions>) {
        options = options ?? {
            removeOnDispose: true,
        };
        const extensionContainer = new ControlExtensionContainer(extension, <ExtensionOptions>options);
        this.extensions.push(extensionContainer);
        extensionContainer.init(this);
    }

    removeExtension(extension: ControlExtension<this>) {
        const isContainer = extension instanceof ControlExtensionContainer;
        const extensionToRemove = isContainer ? extension : this.extensions.find(value => value.extension == extension);
        if (extensionToRemove) {
            this.extensions.remove(extensionToRemove);
        }
    }

    removeFromParent(): void {
        this.container.parent?.removeChild(this.container);
    }

    moveBottom(): this {
        this.container.zIndex = 0;
        this.updateZOrder();
        const children = this.container.parent.children;
        children.remove(this.container);
        children.unshift(this.container);
        return this;
    }

    moveTop(): this {
        const children = this.container.parent.children;
        children.remove(this.container);
        children.push(this.container);
        return this;
    }

    private updateZOrder() {
        this.container.parent.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    remove(control: MainControl): void {
        this.container.removeChild(control.container);
    }

    setPosition(position: {x: number; y: number}) {
        this.container.position.set(
            position.x,
            position.y
        );
    }

    setScale(scale: {x: number; y?: number}) {
        const x = scale.x ?? 0;
        const y = scale.y ?? scale.x;
        this.container.scale.set(
            x,
            y
        );
    }

    setPivotTo(
        displayObject: DisplayObject & {width: number, height: number} = this.container,
        type: PivotType = PivotType.C
    ) {
        const scaleX = displayObject.scale.x;
        displayObject.scale.set(1);
        const width = displayObject.width;
        const height = displayObject.height;
        const centerX = width * .5;
        const centerY = height * .5;
        switch (type) {
            case PivotType.C:
                displayObject.pivot.set(centerX, centerY);
                break;
            case PivotType.L:
                displayObject.pivot.set(0, centerY);
                break;
            case PivotType.TL:
                displayObject.pivot.set(0, 0);
                break;
            case PivotType.T:
                displayObject.pivot.set(centerX, 0);
                break;
            case PivotType.TR:
                displayObject.pivot.set(width, 0);
                break;
            case PivotType.R:
                displayObject.pivot.set(width, centerY);
                break;
            case PivotType.BR:
                displayObject.pivot.set(width, height);
                break;
            case PivotType.B:
                displayObject.pivot.set(centerX, height);
                break;
            case PivotType.BL:
                displayObject.pivot.set(0, height);
                break;
        }
        displayObject.scale.set(scaleX);
    }

    init() {
        this.extensions.forEach(value => {
            value.init(this);
        });
    }

    dispose() {
        this.extensions.slice().forEach(value => {
            value.dispose(this);
            if (value.options.removeOnDispose) {
                this.removeExtension(value);
            }
        });
    }

    async hide(): Promise<this> {
        await this.onHide.emit().all();
        return this;
    }

    async show(): Promise<this> {
        await this.onShow.emit().all();
        return this;
    }

    name(name: string): this {
        this.container.name = name;
        return this;
    }

    setBounds(boundsWidth: number, boundsHeight: number) {
        const container = <BoundsPixiContainer> this.container;
        container.boundsWidth = boundsWidth;
        container.boundsHeight = boundsHeight;
    }
}

export enum PivotType {
    C,
    L,
    TL,
    T,
    TR,
    R,
    BR,
    B,
    BL,
}

export interface ControlExtension<T = MainControl> {
    init(instance: T): void;

    dispose(instance: T): void;
}

type ExtensionOptions = {
    removeOnDispose: boolean;
};

export class ControlExtensionContainer<T> implements ControlExtension<T> {
    isInit = false;

    constructor(readonly extension: ControlExtension<T>, readonly options: ExtensionOptions) {
    }

    init(instance: T): void {
        if (!this.isInit) {
            this.extension.init(instance);
            this.isInit = true;
        }
    }

    dispose(instance: T): void {
        if (this.isInit) {
            this.extension.dispose(instance);
            this.isInit = false;
        }
    }
}
