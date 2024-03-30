/* eslint-disable camelcase */
import * as intro_symbols from "res/spine/symbols/intro_symbols.json";
import * as splash from "res/spine/splash/splash.json";
import * as paytable from "res/spine/paytable/paytable.json";
import * as paytable_page from "res/spine/paytable/paytable_page.json";
import * as symbols from "res/spine/symbols/symbols.json";
import * as fs_intro_popup from "res/spine/popups/fs_intro_popup.json";
import * as paylines from "res/spine/winline/paylines.json";
import * as reels from "res/spine/reels/reels.json";
import * as anticipator from "res/spine/anticipator/anticipator.json";
import * as character from "res/spine/character/character.json";
import * as bonus from "res/spine/symbols/scatter2.json";
import * as wildbonus1 from "res/spine/symbols/wildbonus1.json";
import * as wildbonus2 from "res/spine/symbols/wildbonus2.json";
import * as grass from "res/spine/grass/grass.json";
import {SpineData} from "app/loader/SpineData";
export default class SpineDataStorage {
    static CACHE: { [key: string]: SpineData } = {
        paytable_page: <SpineData><unknown>paytable_page,
        paytable: <SpineData><unknown>paytable,
        splash: <SpineData><unknown>splash,
        intro_symbols: <SpineData><unknown>intro_symbols,
        symbols: <SpineData><unknown>symbols,
        fs_intro_popup: <SpineData><unknown>fs_intro_popup,
        paylines: <SpineData><unknown>paylines,
        reels: <SpineData><unknown>reels,
        anticipator: <SpineData><unknown>anticipator,
        character: <SpineData><unknown>character,
        wildbonus1: <SpineData><unknown>wildbonus1,
        wildbonus2: <SpineData><unknown>wildbonus2,
        bonus: <SpineData><unknown>bonus,
        grass: <SpineData><unknown>grass,
    };
}
