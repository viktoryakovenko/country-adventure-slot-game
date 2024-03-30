import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import {ITextStyle, Text} from "@pixi/text";
import TextStyles from "app/model/TextStyles";

type LabelOpt = {
    titleStyle: Partial<ITextStyle>;
    valueStyle: Partial<ITextStyle>;
    title: string;
    initialValue?: number;
    innerPadding?: number;
};
export default class LabelControl extends MainControl {
    public readonly labelTitle: Text;
    public readonly labelValue: Text;
    private value = 0;

    constructor(container: Container, opt: LabelOpt) {
        super(container);
        opt.initialValue = opt.initialValue ?? 0;
        const innerPadding = opt.innerPadding ?? 0;
        this.labelTitle = new Text(opt.title, TextStyles.LABEL_TITLE_STYLE);
        this.labelValue = new Text(`$ ${this.value}`, TextStyles.LABEL_TEXT_STYLE);
        this.labelTitle.anchor.set(0.5, 0 - innerPadding);
        this.labelValue.anchor.set(0.5, 1 + innerPadding);
        this.labelTitle.position.y = -40;
        this.labelValue.position.y = 25;
        this.setValue(opt.initialValue);
    }

    init() {
        super.init();
        this.container.addChild(this.labelTitle, this.labelValue);
        const boundsWidth = 130;
        const boundsHeight = (boundsWidth * 1082) / 1920;
        this.setBounds(boundsWidth, boundsHeight);
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    setTitle(title: string) {
        this.labelTitle.text = title;
    }

    setValue(value: number) {
        this.labelValue.text = `$ ${value.toFixed(2)}`;
    }
}
