import SpineControl from "app/controls/SpineControl";
import {Container} from "@pixi/display";
import {inject} from "app/model/injection/InjectDecorator";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import gsap from "gsap";

export default class CoinControl extends SpineControl {
    @inject(MotionLayerControl)
    private readonly motionLayer!: MotionLayerControl;
    constructor() {
        super("bonus");
    }

    public async animate(from: Container, to: Container, resolve?: () => void) : Promise<void> {
        this.setPosition(from);
        this.setScale({x: 0, y: 0});

        gsap.to(this.container.scale,
            {
                x: .2,
                y: .2,
                duration: .3 + Math.random() * .5,
                ease: "elastic.out(1.75,0.4)",
            }
        );

        const motionPromise = this.motionLayer.move({
            from: from,
            to: to,
            duration: .75,
            what: this.container,
            fitToSize: false,
            ease: "power1.inOut",
        }).then(() => {
            this.setScale({x: 0, y: 0});
            this.removeFromParent();
        });

        this.playInTime("jump", 0.75);
        await motionPromise;
        resolve && resolve();
    }
}
