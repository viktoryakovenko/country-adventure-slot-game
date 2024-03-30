import {Container} from "@pixi/display";
import TextStyles from "app/model/TextStyles";
import LabelControl from "app/controls/ui/LabelControl";
import CurrencyFormatterHelper from "app/model/CurrencyFormatterHelper";
import {BalanceReplenishmentVisualsExtension} from "app/controls/ui/extensions/BalanceReplenishmentVisualsExtension";

export default class BalanceControl extends LabelControl {
    constructor(private title: string) {
        super(new Container(), {
            titleStyle: TextStyles.LABEL_TITLE_STYLE,
            valueStyle: TextStyles.LABEL_TEXT_STYLE,
            title: title,
            initialValue: 100,
            innerPadding: 0.1,
        });
    }
    init() {
        super.init();
        this.addExtension(new BalanceReplenishmentVisualsExtension());
    }

    dispose() {
        super.dispose();
    }

    setValue(value: number) {
        this.labelValue.text = `${CurrencyFormatterHelper.format(value)} `;
    }
}
