import MainControl from "app/controls/MainControl";
import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class FullScreenBtnControl extends MainControl {
    private readonly fullScreenButtonControl: SpriteSheetButtonControl = new SpriteSheetButtonControl(
        "full_screen_btn.png",
    );
    private readonly exitFullScreenButtonControl: SpriteSheetButtonControl = new SpriteSheetButtonControl(
        "full_screen_exit_btn.png",
    );
    private htmlElement: HTMLElement;

    constructor(htmlElement: HTMLElement = document.body) {
        super();
        this.htmlElement = htmlElement;
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
    }

    init() {
        super.init();
        this.add(this.exitFullScreenButtonControl);
        this.add(this.fullScreenButtonControl);
        this.container.on("pointerup", this.onClick, this);
        window.addEventListener("fullscreenchange", this.onExitFullScreen);
    }

    dispose() {
        this.remove(this.exitFullScreenButtonControl);
        this.remove(this.fullScreenButtonControl);
        window.removeEventListener("fullscreenchange", this.onExitFullScreen);
        this.container.off("pointerup", this.onClick, this);
        super.dispose();
    }

    private async onClick() {
        this.container.eventMode = "auto";
        if (this.isFullscreen()) {
            await this.offFullScreen();
        } else {
            await this.onFullScreen(this.htmlElement);
            this.exitFullScreenButtonControl.moveTop();
        }
        this.container.eventMode = "static";
    }

    private onExitFullScreen = () => {
        if (!this.isFullscreen()) {
            this.fullScreenButtonControl.moveTop();
        }
    };

    private async onFullScreen(htmlElement: HTMLElement): Promise<unknown> {
        if (!htmlElement) {
            return Promise.resolve();
        }
        const el = htmlElement.parentElement as HTMLElementWithAllFSRequests;
        if (el.requestFullscreen) {
            await el.requestFullscreen().catch(reason => {
                console.error(reason);
            });
        } else if (el.mozRequestFullScreen) {
            await el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            await el.msRequestFullscreen();
        } else {
            return Promise.reject(new Error("no methods to resolve fullscreen in"));
        }
    }

    private async offFullScreen(): Promise<unknown> {
        const doc = document as DocWithAllFSExitRequests;
        if (doc.exitFullscreen) {
            await doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            await doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
            await doc.msExitFullscreen();
        } else {
            return Promise.reject(new Error("no methods to resolve fullscreen out"));
        }
    }

    public isFullscreen(): boolean {
        const doc = document as AllFullscreenElements;
        return !!(
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.webkitCurrentFullScreenElement ||
            doc.fullscreenElement
        );
    }
}

type HTMLElementWithAllFSRequests = HTMLElement & {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
};

type DocWithAllFSExitRequests = Document & {
    mozCancelFullScreen(): Promise<void>;
    webkitExitFullscreen(): Promise<void>;
    msExitFullscreen(): Promise<void>;
};

type AllFullscreenElements = Document & {
    webkitFullscreenElement: Element;
    webkitCurrentFullScreenElement: Element;
    mozFullScreenElement: Element;
};
