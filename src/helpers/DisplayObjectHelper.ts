import {Container, DisplayObject} from "@pixi/display";

export default class DisplayObjectHelper {
    public static isChildOff(child: DisplayObject, parent: Container): boolean {
        if (child.parent === null) {
            return false;
        } else if (parent === child) {
            return true;
        } else {
            return this.isChildOff(child.parent, parent);
        }
    }

    public static isChildHaveName(child: DisplayObject, name: string): boolean {
        if (child.parent === null) {
            return false;
        } else if (child.name === name) {
            return true;
        } else {
            return this.isChildHaveName(child.parent, name);
        }
    }
}
