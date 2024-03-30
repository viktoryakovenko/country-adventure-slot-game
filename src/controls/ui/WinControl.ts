import {Container} from "@pixi/display";
import TextStyles from "app/model/TextStyles";
import LabelControl from "app/controls/ui/LabelControl";
import CurrencyFormatterHelper from "app/model/CurrencyFormatterHelper";

export default class WinControl extends LabelControl {
    constructor(private title: string) {
        super(new Container(), {
            titleStyle: TextStyles.LABEL_TITLE_STYLE,
            valueStyle: TextStyles.LABEL_TEXT_STYLE,
            title: title,
            initialValue: 0,
            innerPadding: 0.1,
        });
    }

    setValue(balance: number) {
        this.labelValue.text = balance === 0 ? "" : `${CurrencyFormatterHelper.format(balance)} `;
    }
}
