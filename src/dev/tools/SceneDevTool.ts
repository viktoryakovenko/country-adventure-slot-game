/* eslint-disable @typescript-eslint/no-this-alias */
import {GUI} from "dat.gui";
import gameModel from "app/model/GameModel";
import DevToolUtils from "app/utils/DevToolUtils";
import SceneManager from "app/scenes/SceneManager";
import ReelScene from "app/scenes/subscenes/ReelScene";
import * as hooks from "res/hooks/hooks.json";
import {VisibilitySignals} from "app/model/GameSignals";
import SpineControl from "app/controls/SpineControl";
import {SymbolsDevTool} from "app/dev/tools/SymbolsDevTool";

// noinspection JSUnusedGlobalSymbols
export class SceneDevTool {
    private sceneFolder?: GUI;

    constructor(protected gui: GUI) {
        SceneManager.SIGNALS.SCENE.ACTIVATED.add(value => {
            switch (value.constructor) {
                case ReelScene: {
                    this.setupReelScene(gui, <ReelScene>value);
                    break;
                }
            }
        });
        SceneManager.SIGNALS.SCENE.DIACTIVATED.add(() => {
            this.sceneFolder && gui.removeFolder(this.sceneFolder);
            this.sceneFolder = undefined;
        });
    }

    private setupReelScene(gui: GUI, scene: ReelScene) {
        const self = this;
        let hookName = "";
        const updateHook = () => {
            const hookList = <number[][]>(<never>hooks)[hookName];
            const value: number[] = hookList.shift() ?? [];
            hookList.push(value);
            force.hook = JSON.stringify(value);
            gameModel.mainGameInfo.hook = JSON.parse(force.hook);
            this.sceneFolder?.updateDisplay();
        };
        SceneManager.SIGNALS.SCENE.DIACTIVATED.addOnce(() => {
            gameModel.game.signals.spinComplete.remove(updateHook);
        }, this);
        const getPopupActions = <T>(signals: VisibilitySignals<T>, payload: T) => {
            const result = {
                payload,
                showPopup: () => {
                    signals.show.emit(result.payload);
                },
                hidePopup: () => {
                    signals.hide.emit();
                },
            };
            return result;
        };
        const popups = {
            intro: getPopupActions(gameModel.game.signals.popup.fsIntro, 10),
            outro: getPopupActions(gameModel.game.signals.popup.fsOutro, 10_000),
            winCounter: getPopupActions(gameModel.game.signals.popup.winCounter, 100500.100500),
            lowWinCounter: getPopupActions(gameModel.game.signals.popup.winCounter, 10),
        };
        const symbols = new SymbolsDevTool(scene.reelsControl).getTool();
        const force = {
            hook: "[0, 0, 0, 0, 0]",
            _hookUpdate: () => {
                console.log(force.hook);
                force.hook = force.hook == "" ? "[]" : force.hook;
                gameModel.mainGameInfo.hook = JSON.parse(force.hook);
            },
            hooks: Object.keys(hooks),
            _hooksItems: Object.keys(hooks).filter(value => value != "default"),
            _hooksUpdate: (value: never) => {
                hookName = value;
                updateHook();
                force.hook = JSON.stringify((<never>hooks)[value][0]);
                gameModel.mainGameInfo.hook = JSON.parse(force.hook);
                this.sceneFolder?.updateDisplay();
                gameModel.game.signals.spinComplete.remove(updateHook);
                gameModel.game.signals.spinComplete.add(updateHook, self);
            },
            force: () => {
                gameModel.game.fruit.serverCommunicator.forceReelStop(JSON.parse(force.hook)).then();
            },
        };
        const target = {
            lines: {
                lineNumbers: "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]",
                _lineNumbersUpdate: () => {
                    gameModel.game.signals.reels.hideLines.emit();
                    const list: number[] = JSON.parse(target.lines.lineNumbers);
                    list.forEach(lineNumber => gameModel.game.signals.reels.showLine.emit(lineNumber));
                },
                show: () => {
                    const list: number[] = JSON.parse(target.lines.lineNumbers);
                    list.forEach(lineNumber => gameModel.game.signals.reels.showLine.emit(lineNumber));
                },
            },
            reels: {
                reelStopsStr: "[0, 0, 0, 0, 0]",
                _reelStopsStrUpdate: () => {
                    const list: number[] = JSON.parse(target.reels.reelStopsStr);
                    list.forEach((value, index) => target.reels.reelStops[index] = value);
                    this.sceneFolder?.updateDisplay();
                },
                reelStops: [0, 0, 0, 0, 0],
                reelSpeed: 20,
                reelOffset: -0.025,
                _reelOffsetStep: .001,
                _reelOffsetMin: -.25,
                _reelOffsetMax: 1.25,
                _reelOffsetUpdate: () => {
                    gameModel.game.signals.reels.updateReelOffset.emit(target.reels.reelOffset);
                },
                reelOffsetUpdate: () => {
                    gameModel.game.signals.reels.updateReelOffset.emit(target.reels.reelOffset);
                },
                blur: () => {
                    scene.reelsControl.updateSkins("blur/scatter");
                },
                unblur: () => {
                    scene.reelsControl.updateSkins("scatter");
                },
                spin: (reelSpeed?: number) => scene.startReelSpinning(reelSpeed ?? target.reels.reelSpeed),
                stop: () => scene.stopReelSpinning(target.reels.reelStops),
                showDevInfo: () => {
                    scene.showDebugInfo();
                },
                hideDevInfo: () => {
                    scene.hideDebugInfo();
                },
                moveToReelStops: async () => {
                    await Promise.all(scene.reelsControl.reels.map(async (value, index) => {
                        await value.moveTo(target.reels.reelStops[index]);
                    }));
                },
                moveDown: async () => {
                    target.reels.reelStops.forEach((value, index) => {
                        target.reels.reelStops[index] = value + 1;
                    });
                    target.reels.reelStopsStr = JSON.stringify(target.reels.reelStops);
                    this.sceneFolder?.updateDisplay();
                    await Promise.all(scene.reelsControl.reels.map(async (value, index) => {
                        await value.moveTo(target.reels.reelStops[index]);
                    }));
                },
                moveUp: async () => {
                    target.reels.reelStops.forEach((value, index) => {
                        target.reels.reelStops[index] = value - 1;
                    });
                    await Promise.all(scene.reelsControl.reels.map(async (value, index) => {
                        await value.moveTo(target.reels.reelStops[index]);
                    }));
                },
            },
        };
        this.sceneFolder = gui.addFolder("Reel scene");

        DevToolUtils.setupObj(force, "forces", this.sceneFolder);
        if (BUILD_TYPE !== "PROD") {
            DevToolUtils.setupObj(popups, "popups", this.sceneFolder);
            DevToolUtils.setupObj(symbols, "symbols", this.sceneFolder);
            DevToolUtils.setupObj(target, "", this.sceneFolder);
        }
    }

    private getSpineDevControl(spine: SpineControl) {
        const animations: Record<string, unknown> & { loop: boolean } = {
            loop: false,
        };
        spine.spine.spineData.animations.forEach((value, index) => {
            animations[value.name] = () => {
                spine.play(value.name, {loop: animations.loop, trackIndex: index});
            };
        });
        return animations;
    }
}
