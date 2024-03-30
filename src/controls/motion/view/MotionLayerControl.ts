import {Container, DisplayObject} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import MotionPort from "app/controls/motion/port/MotionPort";
import {
    ContainerData,
    CurveMotionData,
    GeneralMotionData,
    MotionData,
    PlayOnData,
} from "app/controls/motion/data/MotionData";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {Point, Rectangle} from "@pixi/math";
import promiseHelper from "app/helpers/promise/ResolvablePromise";
import {promiseDelay, TimeUnit} from "app/helpers/TimeHelper";
import MainControl from "app/controls/MainControl";
import {ResizableControl} from "app/controls/extensions/OnResizeExtension";
import {GameSize} from "app/model/GameModel";
import {FadeInOutVisibilityExtension} from "app/controls/extensions/VisibilityExtension";

type GraphicPath = {
    moveBy?: Point;
    repeat?: number,
    repeatDelay?: number,
    yoyo?: boolean,
    path: number[],
    drawDebugPath?: boolean,
};
export default class MotionLayerControl extends MainControl implements ResizableControl {
    private readonly alphaLayer: Container;
    private readonly bgGraphics: Graphics = new Graphics();
    private isPortrait: boolean | undefined;
    private readonly screen = {
        width: 1920,
        height: 1920,
        offsetX: -1920 * .5,
        offsetY: -1920 * .5,
    };

    constructor() {
        super(new Container());
        this.alphaLayer = this.container;
        this.addExtension(new FadeInOutVisibilityExtension(0.25, 0.25));
    }

    init() {
        this.updateBgRegardingAspect();
        this.alphaLayer.addChild(this.bgGraphics);
        this.alphaLayer.alpha = 0;
        this.container.sortableChildren = true;
        this.initListeners();
    }

    private initListeners() {
        MotionPort.PORT.SHOW.add(this.show, this);
        MotionPort.PORT.HIDE.add(this.hide, this);
        MotionPort.PORT.PLAY_ON.add(this.playOn, this);
        MotionPort.PORT.MOVE.add(this.move, this);
        MotionPort.PORT.MOVE_BY_CURVE.add(this.moveByUsingCurve, this);
        MotionPort.PORT.GET_ELEMENT_POSITION.add(this.getElementPosition, this);
    }

    resize(data: GameSize) {
        this.screen.width = data.width;
        this.screen.height = data.height;
        const isPortrait = data.isPortrait;
        if (this.isPortrait !== isPortrait) {
            this.isPortrait = isPortrait;
            this.screen.offsetX = 0;
            this.screen.offsetY = 0;
        }
        this.updateBgRegardingAspect();
    }


    async playOn(data: PlayOnData, resolve?: () => void) {
        this.validateGeneralData(data);
        const where = data.where ? data.where : this.container.parent;
        data.offsetX = data.offsetX ?? 0;
        data.offsetY = data.offsetY ?? 0;
        const position = this.getLocalPosition(data.on, data.offsetX, data.offsetY, where);
        data.what.position.copyFrom(position);
        const duration = data.duration ? data.duration : 0.5;
        data.what.position.copyFrom(position);
        where.addChild(data.what);
        await Promise.race([data.breakPromise, promiseDelay(duration, TimeUnit.sec)]);
        resolve?.();
    }

    async move(data: MotionData, resolve?: () => void) {
        this.validateGeneralData(data);
        const where = data.where ? data.where : this.container.parent;
        const fromPosition = this.getLocalPosition(data.from, data.offsetX, data.offsetY, where);
        const toPosition = this.getLocalPosition(data.to, 0, 0, where);
        const duration = data.duration ? data.duration : 0.5;
        const bounds = this.getGlobalBounds(<Container>data.to);
        data.what.position.copyFrom(fromPosition);
        where.addChild(data.what);
        const promises = [];
        const promise = pgsap.to(data.what, {
            duration,
            breakPromise: data.breakPromise,
            x: toPosition.x,
            y: toPosition.y,
            ease: data.ease,
        });
        promises.push(promise);
        if (data.fitToSize) {
            promises.push(pgsap.to(data.what, {
                duration,
                width: bounds.width,
                height: bounds.height,
            }));
        }
        await promises.promise().all();
        data.what.position.copyFrom(toPosition);
        resolve?.();
    }

    private moveByUsingCurve(data: CurveMotionData, resolve?: () => void) {
        this.validateGeneralData(data);
        data.toOffsetX = data.toOffsetX ? data.toOffsetX : 0;
        data.toOffsetY = data.toOffsetY ? data.toOffsetY : 0;
        data.motionPathType = data.motionPathType ? data.motionPathType : "cubic";
        data.repeat = data.repeat ? data.repeat : 0;
        data.repeatDelay = data.repeatDelay ? data.repeatDelay : 0;
        data.yoyo = data.yoyo ? data.yoyo : false;
        const fromPosition = this.getLocalPosition(data.from, data.offsetX, data.offsetY);
        const toPosition = this.getLocalPosition(data.to, data.toOffsetX, data.toOffsetY);
        const pointsPath = [{
            x: fromPosition.x,
            y: fromPosition.y,
        }];
        data.path.unshift(fromPosition.x, fromPosition.y);
        data.path.push(toPosition.x, toPosition.y);

        const path = data.path;
        for (let i = 0; i < path.length; i = i + 2) {
            pointsPath.push({x: path[i], y: path[i + 1]});
        }
        let dispose = () => {
        };
        if (data.sendToBack) {
            this.container.parent.addChildAt(data.what, 1);
        } else {
            this.container.parent.addChild(data.what);
        }
        if (data.drawDebugPath) {
            const graphics = MotionLayerControl.getDebugGraphicsPath(data, path);
            this.container.parent.addChild(graphics);
            dispose = () => {
                graphics.parent.removeChild(graphics);
            };
        }
        data.what.position.set(0, 0);
        const targets = {position: data.moveBy, x: data.path[0], y: data.path[1]};
        const moveBy = data.moveBy ?? {x: 0, y: 0};
        pgsap.to(targets, {
            breakPromise: data.breakPromise,
            duration: data.duration,
            repeat: data.repeat,
            repeatDelay: data.repeatDelay,
            yoyo: data.yoyo,
            ease: "none",
            onUpdate: () => {
                moveBy.x = targets.x;
                moveBy.y = targets.y;
            },
            onComplete: () => {
                dispose();
                resolve?.();
            },
            motionPath: {
                path: pointsPath,
                autoRotate: true,
                type: data.motionPathType,
            },
        });
    }

    getElementPosition(data: Container | ContainerData, resolve?: () => void): Point {
        const container = data instanceof Container ? data : data.container;
        const offsetX = data instanceof Container ? 0 : data.offsetX;
        const offsetY = data instanceof Container ? 0 : data.offsetY;
        resolve?.();
        return this.getLocalPosition(container, offsetX, offsetY);
    }

    protected getGlobalBounds(displayObject: Container): Rectangle {
        const localPosition = this.getLocalPosition(displayObject);
        const localBRPosition = this.getLocalPosition(displayObject, displayObject.width, displayObject.height);
        return new Rectangle(
            localPosition.x,
            localPosition.y,
            Math.abs(localBRPosition.x - localPosition.x),
            Math.abs(localBRPosition.y - localPosition.y)
        );
    }

    protected getLocalPosition(displayObject: DisplayObject, offsetX = 0, offsetY = 0, where?: Container): Point {
        let result;
        if (offsetX != 0 || offsetY != 0) {
            const oldX: number = displayObject.x;
            const oldY: number = displayObject.y;
            displayObject.x -= offsetX;
            displayObject.y -= offsetY;
            result = displayObject.toGlobal(new Point(0, 0));
            displayObject.x = oldX;
            displayObject.y = oldY;
        } else {
            result = displayObject.toGlobal(new Point(0, 0));
        }

        result.set(
            result.x / this.container.parent.scale.x,
            result.y / this.container.parent.scale.y
        );
        where = where ? where : this.container;
        return where.toLocal(result);
    }

    private static getDebugGraphicsPath(data: GraphicPath & MotionData, path: number[]) {
        const graphics = new Graphics();
        graphics.lineStyle(3, 0x3500FA, 1);
        graphics.moveTo(
            data.path[0],
            data.path[1]
        );
        data.moveBy?.set(
            data.path[0],
            data.path[1]
        );
        for (let i = 0; i < data.path.length; i += 6) {
            graphics.bezierCurveTo(
                data.path[i],
                data.path[i + 1],
                data.path[i + 2],
                data.path[i + 3],
                data.path[i + 4],
                data.path[i + 5]
            );
        }
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffffff];
        for (let i = 0; i < path.length; i = i + 2) {
            graphics.lineStyle(3, colors[i / 2], 1);
            graphics.drawRect(data.path[i] - 5, data.path[i + 1] - 5, 10, 10);
        }
        graphics.moveTo(100, 100);
        return graphics;
    }

    private updateBgRegardingAspect() {
        const graphics = this.bgGraphics;
        graphics.clear();
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, this.screen.width, this.screen.height);
        graphics.endFill();
        graphics.position.set(this.screen.offsetX, this.screen.offsetY);
    }

    protected validateGeneralData(data: GeneralMotionData) {
        data.breakPromise = data.breakPromise ? data.breakPromise : promiseHelper.getResolvablePromise();
    }
}
