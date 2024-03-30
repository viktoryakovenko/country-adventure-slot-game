import MainControl from "app/controls/MainControl";
import {Text, TextStyle} from "@pixi/text";
import {Container} from "@pixi/display";
import gsap from "gsap";
import TextStyles from "app/model/TextStyles";
import {ensure} from "app/helpers/ObjectHelper";

export class MessageBarControl extends MainControl {
    private readonly messageText: Text;
    private readonly fontStyle = new TextStyle(TextStyles.MESSAGE_BAR_TEXT_STYLE);
    private readonly messageArray: Array<string>;
    private readonly updateFrequency: number;
    private gsapUpdateInterval!: GSAPTween;

    constructor(messageArray: Array<string>, updateFrequency: number) {
        super(new Container());
        this.messageArray = messageArray;
        this.updateFrequency = updateFrequency;
        this.messageText = new Text("", this.fontStyle);
    }

    init() {
        super.init();
        this.container.addChild(this.messageText);
        this.messageText.anchor.set(0.5);
        this.update();
        this.startUpdating();
        const scale = .8;
        this.setBounds(1120 * scale, 30 * scale);
    }

    private update() {
        const newMessage = ensure(this.messageArray.shift());
        this.messageArray.push(newMessage);
        this.messageText.text = `${newMessage}`;
    }

    startUpdating() {
        this.gsapUpdateInterval = gsap.set(this.update, {
            delay: this.updateFrequency,
            onRepeat: () => this.update(),
            repeat: -1,
            repeatDelay: this.updateFrequency,
        });
    }

    stopUpdating() {
        this.gsapUpdateInterval.pause();
    }

    dispose() {
        this.gsapUpdateInterval.kill();
        this.container.removeChild(this.messageText);
        super.dispose();
    }
}
