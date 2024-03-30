import MainControl, {ControlExtension} from "app/controls/MainControl";
import Signal from "app/helpers/signals/signal/Signal";
import gsap from "gsap";

type ShakingData = {
    duration: {
        down: number,
        up: number,
    }
    yOffset: number,
};

class ShakeControl {
    speedFactor = 1;

    constructor(protected readonly control: MainControl, protected readonly shaking: ShakingData) {

    }

    private shakeTimeline!: gsap.core.Timeline;

    shake() {
        if (this.shakeTimeline) {
            this.shakeTimeline.totalProgress(1).kill();
        }
        const initialY = {y: this.control.container.position.y};
        this.shakeTimeline = gsap.timeline({
            onComplete: () => {
                this.control.container.position.y = initialY.y;
            },
        }).to(this.control.container.position, {
            y: this.control.container.position.y + this.shaking.yOffset,
            ease: "rough({ strength: 12, points: 20, template: none.out })",
            duration: this.shaking.duration.down / this.speedFactor,
            repeat: 1,
            yoyo: true,
        }).to(this.control.container.position, {
            y: initialY.y,
            duration: this.shaking.duration.up / this.speedFactor,
        });
    }
}

export class ShakeExtension implements ControlExtension {
    constructor(
        private signals: {
            shakeSignal: Signal<void>,
            speedFactorUpdate: Signal<number>,
        },
        protected readonly shaking: ShakingData,
    ) {
    }

    init(instance: MainControl): void {
        const shakeControl = new ShakeControl(instance, this.shaking);
        this.signals.speedFactorUpdate.add((speedFactor: number) => {
            shakeControl.speedFactor = speedFactor;
        }, instance);
        this.signals.shakeSignal.add(() => {
            shakeControl.shake();
        }, instance);
    }

    dispose(instance: MainControl): void {
        this.signals.shakeSignal.unload(instance);
        this.signals.speedFactorUpdate.unload(instance);
    }
}
