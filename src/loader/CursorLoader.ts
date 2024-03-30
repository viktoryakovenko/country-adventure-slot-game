import {Main} from "app/Main";

export default class CursorLoader {
    static async setUp(): Promise<void> {
        Main.APP.renderer.events.cursorStyles.default = "url('assets/cursors/woodDefault.png'), auto";
        Main.APP.renderer.events.cursorStyles.pointer = "url('assets/cursors/woodPointer.png'), auto";
    }
}
