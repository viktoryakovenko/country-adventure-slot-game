/* eslint-disable camelcase */
import * as background from "res/spine/background/background.json";
import {SpineData} from "app/loader/SpineData";

export default class SpineDataStorage {
    static CACHE: { [key: string]: SpineData } = {
        background: <SpineData><unknown>background,
    };
}
