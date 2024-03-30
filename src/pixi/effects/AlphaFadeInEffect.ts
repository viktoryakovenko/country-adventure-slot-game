import {Container} from "@pixi/display";
import {Ticker} from "@pixi/ticker";

export default class AlphaFadeInEffect {
    constructor(container:Container, ticker:Ticker) {
        container.alpha = 0;
        const effectRender = () => {
            container.alpha += (1 - container.alpha) * .125;
            if (container.alpha > 1) {
                container.alpha = 1;
                ticker.remove(effectRender);
            }
        };
        ticker.add(effectRender);
    }
}
