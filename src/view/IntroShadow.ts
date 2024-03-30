import SpriteContainer from "app/view/SpriteContainer";
import {GameSize} from "app/model/GameModel";
import {Container} from "@pixi/display";

export default class IntroShadow extends Container {
    private leftShadow = new SpriteContainer("bg_shadow.png");
    private rightShadow = new SpriteContainer("bg_shadow.png");
    private topShadow = new SpriteContainer("bg_shadow.png");
    private bottomShadow = new SpriteContainer("bg_shadow.png");
    private readonly container1 = new Container();
    private readonly container2 = new Container();

    constructor() {
        super();
        this.leftShadow.anchor.x = 1;
        this.leftShadow.scale.x = -1;
        this.bottomShadow.angle = 90;
        this.bottomShadow.anchor.y = 1;
        this.topShadow.anchor.set(1);
        this.topShadow.angle = 90;
        this.topShadow.scale.x = -1;
        this.container1.name = "rightShadow";
        this.container2.name = "leftShadow";
        this.addChild(this.container1, this.container2);
    }

    resize(gameSize: GameSize) {
        this.container1.removeChildren();
        this.container2.removeChildren();
        if (gameSize.isPortrait) {
            this.container1.addChild(this.bottomShadow);
            this.container2.addChild(this.topShadow);
        } else {
            this.container1.addChild(this.rightShadow);
            this.container2.addChild(this.leftShadow);
        }
    }
}
