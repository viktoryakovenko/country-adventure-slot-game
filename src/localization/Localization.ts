import {ensure} from "app/helpers/ObjectHelper";

export default class Localization {
    private lang = "en";
    private translations = new Map<string, {[k:string]:string}>();

    constructor(defaultLanguage: string) {
        this.lang = defaultLanguage;
    }

    addTranslation(lang: string, translations: {[k:string]:string}) {
        this.translations.set(lang, translations);
    }

    text(key: string) {
        return ensure(
            (this.translations.get(this.lang) ?? {})[key],
            `No text for lang: [${this.lang}] and text key: [${key}]`
        );
    }

    setLang(key: string) {
        this.lang = key;
    }
}
