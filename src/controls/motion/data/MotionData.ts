import {ResolvablePromise} from "app/helpers/promise/ResolvablePromise";
import {Container, DisplayObject} from "@pixi/display";
import {Point} from "@pixi/math";

export type OffsetsMotionData = {
    offsetX?:number;
    offsetY?:number;
};

export type GeneralMotionData = {
    breakPromise?:ResolvablePromise<unknown>
};

export type PlayOnData = {
    on:DisplayObject;
    what:DisplayObject;
    where?:Container;
    /**
     in seconds
     */
    duration?:number;
} & GeneralMotionData & OffsetsMotionData;

export type MotionData = {
    from:DisplayObject;
    to:DisplayObject;
    fitToSize:boolean;
    what:DisplayObject;
    where?:Container;
    /**
     in seconds
     */
    duration?:number;
    offsetX?:number;
    offsetY?:number;
    ease?: string;
} & GeneralMotionData;

export type CurveMotionData = {
    moveBy?:Point;
    repeat?:number;
    motionPathType?:string;
    repeatDelay?:number;
    yoyo?:boolean;
    path:number[];
    drawDebugPath?:boolean;
    sendToBack?:boolean;
    toOffsetX?:number;
    toOffsetY?:number;
} & MotionData;

export type ContainerData = {
    container:Container,
    offsetX?:number;
    offsetY?:number;
};
