import MainControl, {ControlExtension} from "app/controls/MainControl";
import Localization from "app/localization/Localization";
import {inject} from "app/model/injection/InjectDecorator";
import {Container} from "@pixi/display";

export class LocalizationExtension implements ControlExtension {
    @inject(Localization)
    private readonly localization!: Localization;

    init(instance: MainControl): void {
        instance.container.children.filter(value => value.name?.includes("to_translate")).forEach(value => {
            const key = (value.name ?? "").replace("_to_translate", "").replace("to_translate", "");
            (<{ text: string }><unknown>(<Container>value).children[0]).text = this.localization.text(key);
        });
    }

    dispose(): void {
    }
}
