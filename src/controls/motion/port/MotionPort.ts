import Signal from "app/helpers/signals/signal/Signal";
import {ContainerData, CurveMotionData, MotionData, PlayOnData} from "app/controls/motion/data/MotionData";
import {Container} from "@pixi/display";

export default class MotionPort {
    static readonly PORT = {
        SHOW: new Signal<void>(),
        HIDE: new Signal<void>(),
        MOVE: new Signal<MotionData>(),
        PLAY_ON: new Signal<PlayOnData>(),
        MOVE_BY_CURVE: new Signal<CurveMotionData>(),
        GET_ELEMENT_POSITION: new Signal<Container|ContainerData>(),
    };
}
