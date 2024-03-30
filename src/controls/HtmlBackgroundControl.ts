export default class HtmlBackgroundControl {
    public background:HTMLDivElement;

    constructor(private url:string) {
        this.background = document.createElement("div");
        const image = new Image();
        image.src = url;
        image.onload = () => {
            this.setBackgroundStyle();
            this.background.style.opacity = "0";
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    this.background.style.opacity = i / 30 + "";
                }, i * 25);
            }
        };
    }

    private setBackgroundStyle() {
        this.background.style.background = `no-repeat url("${this.url}")`;
        this.background.style.backgroundColor = "black";
        this.background.style.position = "fixed";
        this.background.style.width = "100%";
        this.background.style.height = "100%";
        this.background.style.zIndex = "-100500";
        this.background.style.backgroundPosition = "center";
        this.background.style.backgroundSize = "cover";
    }
}
