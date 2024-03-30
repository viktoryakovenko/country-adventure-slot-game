import {GUI} from "dat.gui";
import gameModel from "app/model/GameModel";
import * as sounds from "res/sounds/sound_list.json";
import DevToolUtils from "app/utils/DevToolUtils";

// noinspection JSUnusedGlobalSymbols
export class SoundDevTool {
    constructor(gui: GUI) {
        const soundsGui = gui.addFolder("sounds");
        gameModel.game.signals.loader.complete.promise().then(() => {
            Object.keys(sounds).forEach(value => {
                const sound = value.replace(/\..*/, "");
                DevToolUtils.setupObj(this.getSoundsActions(sound), "", soundsGui);
            });
        });
    }

    private getSoundsActions(sound: string) {
        let soundId = 0;
        const howler = gameModel.getHowler();
        const soundAction = {
            rate: 1,
            _rateMin: 0,
            _rateMax: 5,
            _rateStep: 0.001,
            _rateUpdate: () => {
                howler.rate(soundAction.rate, soundId);
            },
            volume: 1,
            _volumeMin: 0,
            _volumeMax: 1,
            _volumeStep: 0.001,
            _volumeUpdate: () => {
                howler.volume(soundAction.volume, soundId);
            },
            play: () => {
                howler.stop(soundId);
                soundId = howler.play(sound);
                howler.rate(soundAction.rate, soundId);
                howler.volume(soundAction.volume, soundId);
            },
            rateUp: () => {
                howler.stop(soundId);
                soundId = howler.play(sound);
                soundAction.rate += 0.1;
                howler.rate(soundAction.rate, soundId);
            },
            rateDown: () => {
                howler.stop(soundId);
                soundId = howler.play(sound);
                soundAction.rate -= 0.1;
                howler.rate(soundAction.rate, soundId);
            },
            loop: () => {
                howler.stop(soundId);
                soundId = howler.play(sound);
                howler.loop(true, soundId);
            },
            fadeDown: () => {
                howler.fade(1, 0, 1000, soundId);
            },
            stop: () => {
                howler.stop(soundId);
            },
            mute: () => {
                howler.mute(true, soundId);
            },
        };
        return {
            [`${sound}`]: soundAction,
        };
    }
}
