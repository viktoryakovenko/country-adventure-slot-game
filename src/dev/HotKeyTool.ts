/* eslint-disable */
export default class HotKeyTool {
    private actions:Map<string, Array<Action>> = new Map();
    private isDevice:boolean;
    private static _instance:HotKeyTool;
    /**
     * @deprecated Only for dev debugging. remove in release packages;
     */
    static get instance():HotKeyTool {
        if (!this._instance) {
            this._instance = new HotKeyTool();
        }
        return this._instance;
    }

    private constructor() {
        this.isDevice = eval("(navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)") != false;
        if (this.isDevice) {
            // new HotKeyPanel(actions).activateTouchScreen();
        }
        // new ErrorsConsole().activateScreen();
        this.activateHotKeys();
        this.initSystemHotkeys();
    }

    public activateHotKeys():void {
        document.addEventListener("keypress", (event) => {
            this.onkeypress(event);
        });
    }

    private initSystemHotkeys():void {
        const unRegisterFunctionalKeys = () => {
            for (let i = 0; i < 10; i++) {
                this.unregisterOnKey(`${i}`);
            }
            this.unregisterOnKey(" ");
        };
        if (!this.isDevice) {
            this.registerOnKey("`", () => {
                // new HotKeyPanel(actions).activateTouchScreen();
                // new ErrorsConsole().activateScreen();
                this.unregisterOnKey("`");
                this.registerOnKey("`", ()=>{

                }, "Show FPS meter");
            }, "activate touch screen");
        }
        this.registerOnKey("F10", this.dispatchKeyBoardDownEvent.bind(this, {keyCode: 121}), "TODO: Show Fps graph tool");
        this.registerOnKey("Alt + i", this.dispatchKeyBoardDownEvent.bind(this, {
            keyCode: 73,
            altKey: true,
        }), "Show elements inspector");
        this.registerOnKey("d", unRegisterFunctionalKeys.bind(this), "UNREGISTER SYSTEM KEYS");
        this.registerOnKey("~", this.showAllPopupWithHotKeysDescriptions.bind(this), "Show popup with hot keys descriptions");
    }

    private dispatchKeyBoardDownEvent(eventData:KeyboardEventInit):void {
        const e = new KeyboardEvent("keydown", eventData);
        document.body.dispatchEvent(e);
        window.dispatchEvent(e);
    }

    public showAllPopupWithHotKeysDescriptions():void {
        const allActions:Array<Action> = [];
        for (const actions of Array.from(this.actions.values())) {
            for (const action of actions) {
                allActions.push(action);
            }
        }
        while (allActions.length > 0) {
            const actions = allActions.splice(0, 23);
            if (!this.showPopupWithActionsDescription(actions)) {
                return;
            }
        }
    }

    public showPopupWithActionsDescription(actions:Array<Action>):boolean {
        let message = "Actual reserved hot keys:\n";
        for (const action of actions) {
            message += `• ${action.key} : ${action.description}\n`;
        }
        return window.confirm(message);
    }

    public unregisterOnKey(key:string):void {
        if (this.actions.has(key)) {
            this.actions.delete(key);
        }
    }

    public unRegisterOnKeyCode(keyCode:number):void {
        const key = this.getKeyCode(keyCode);
        if (this.actions.has(key)) {
            this.actions.delete(key);
        }
    }

    public registerOnKeyCode(keyCode:number, action:Function, description = "Empty description"):void {
        const key = this.getKeyCode(keyCode);
        if (!this.actions.has(key)) {
            this.actions.set(key, []);
        }
        this.actions.get(key)!.push(new Action(action, description, key, keyCode));
    }

    private getKeyCode(keyCode:number):string {
        return `keyCode_${keyCode}`;
    }

    public registerOnKey(key:string, action:Function, description = "Empty description"):void {
        const theSameAction:Action|null = this.getActionByKeyAndDescription(key, description);
        if (!this.actions.has(key)) {
            this.actions.set(key, []);
        }
        const actions = this.actions.get(key);
        if (theSameAction != null && actions) {
            // this.actions.get(key)!.remove(theSameAction);
            const startIndex = actions.indexOf(theSameAction);
            startIndex >= 0 && actions.splice(startIndex);
            const bindedAction = () => {
                theSameAction.action.call(this);
                action.call(this);
            };
            actions!.push(new Action(bindedAction, description, key));
        } else {
            actions!.push(new Action(action, description, key));
        }
    }

    private getActionByKeyAndDescription(key:string, description:string):Action|null {
        let result:Action|null = null;
        const actions = this.actions.get(key);
        if (actions) {
            for (const action of actions) {
                if (action.description == description) {
                    result = action;
                    break;
                }
            }
        }
        return result;
    }

    private onkeypress(e:KeyboardEvent):void {
        console.log(
            `GC::HotKeyTool:
                \te.ctrlKey: ${e.ctrlKey}
                \te.altKey: ${e.altKey}
                \te.shiftKey: ${e.shiftKey}
                \te.charCode: ${e.charCode}
                \te.keyCode: ${e.keyCode}
                \te.key: ${e.key}
                \te.repeat: ${e.repeat}
            `
        );
        this.call(e.key);
        this.call(this.getKeyCode(e.keyCode));
    }

    public unRegisterFunctionalKeys():void {
        this.call("e");
    }

    public call(key:string):void {
        const actions = this.actions.get(key);
        if (actions) {
            for (const action of actions) {
                if (action.action != null) {
                    action.action.call(this);
                }
            }
        }
    }
}

export class Action {
    public action:Function;
    public description:string;
    public key:string;
    public keyCode?:number;

    public constructor(action:Function, description:string, key:string, keyCode?:number) {
        this.action = action;
        this.description = description;
        this.key = key;
        this.keyCode = keyCode;
    }
}
