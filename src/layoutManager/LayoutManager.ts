/* eslint-disable max-len */
import ArrayUtils from "./../helpers/ArrayUtils";
import {ensure} from "./../../src/helpers/ObjectHelper";

export type LayoutSize = {
    width:number;
    height:number;
    x:number;
    y:number;
};
export type LayoutGameSize = {
    width:number;
    height:number;
    centerPosition:{x:number, y:number};
    scale:number;
};

export interface LayoutPlugin {
    beforeUpdate():void;

    afterUpdate():void;

    update(layout:Layout):void;

    dispose():void;
}

type LayoutUnit = number | `${number}%` | undefined;
type LayoutOffsets = {
    top:LayoutUnit;
    right:LayoutUnit;
    bottom:LayoutUnit;
    left:LayoutUnit;
};
export type LayoutAlign = "t" | "r" | "b" | "l" | "c" | "tr" | "tl" | "br" | "bl";
export type LayoutName = {
    name:string;
};
export type PartialAspectLayout = Omit<PartialLayout, keyof LayoutName>;
export type PartialLayout = PartialLayouts & Partial<Omit<Layout, keyof Layouts>> & Required<LayoutName>;
export type PartialLayouts = Partial<{layouts:PartialLayout[]}>;
export type Layouts = {layouts:Layout[]};

export type ExtendableLayout = {
    uid:string;
    extend:string | string[];
};
export type AspectLayoutKey = `${number}/${number}`;
export type AspectLayout = {
    [key:AspectLayoutKey]:PartialAspectLayout
};

export type Layout = {
    width:LayoutUnit;
    height:LayoutUnit;
    merging?:LayoutOffsets;
    padding:LayoutOffsets;
    top:LayoutUnit;
    left:LayoutUnit;
    align:LayoutAlign;
    alignIn:LayoutAlign;
    avoidBounding?: "yes" | "no";
    finalLayout:LayoutSize,
    sortBy:"vertical" | "horizontal",
    display:"relative" | "fixed" | "table",
    aspects:AspectLayout,
    scaleBy:"height" | "width" | "both" | "none" | "fit.in" | "fit.out"
} & LayoutName & Layouts & ExtendableLayout;

// noinspection SuspiciousTypeOfGuard
export default class LayoutManager {
    protected readonly layouts:Layout[] = [];
    protected readonly uniqueLayouts:PartialLayout[] = [];
    protected readonly plugins:LayoutPlugin[] = [];
    private readonly applicationUpdateRequest:() => void;

    constructor(applicationUpdateRequest?:() => void) {
        this.applicationUpdateRequest = applicationUpdateRequest != undefined ? applicationUpdateRequest : () => {};
    }

    addLayout(...partialLayouts:Array<PartialLayout>):Layout[] {
        const layouts = partialLayouts.map(partialLayout => this.getLayoutFromPartial(partialLayout));
        this.layouts.push(...layouts);
        this.uniqueLayouts.push(...partialLayouts.filter(value => value.uid && value.uid != ""));
        return layouts;
    }

    clearLayouts() {
        this.layouts.length = 0;
        this.uniqueLayouts.length = 0;
    }

    removeLayout(...layouts:PartialLayout[]) {
        layouts.forEach(layout => {
            const layoutByName = this.getLayoutByName(layout.name);
            ArrayUtils.remove(this.layouts, layoutByName);
            if (layout.uid && layout.uid != "") {
                ArrayUtils.remove(this.uniqueLayouts, this.getLayoutByUid(layout.uid));
            }
        });
    }

    getLayoutByName(name:string):Layout {
        return this.layouts.filter(value => value.name == name)[0];
    }

    getLayoutByUid(uid:string):PartialLayout {
        return this.uniqueLayouts.filter(value => value.uid == uid)[0];
    }

    private getLayoutFromPartial(partialLayout:Partial<PartialLayout> & Required<LayoutName>):Layout {
        if (partialLayout.extend && partialLayout.extend != "") {
            this.uniqueLayouts.filter(value => value.uid == partialLayout.extend || value.uid && ensure(partialLayout.extend).indexOf(value.uid) >= 0).forEach(baseLayout => {
                this.extendLayout(partialLayout, baseLayout);
            });
        }
        const layout:Layout = {
            uid: partialLayout.uid ?? "",
            extend: partialLayout.extend ?? "",
            name: partialLayout.name,
            aspects: partialLayout.aspects ?? {},
            layouts: partialLayout.layouts ? partialLayout.layouts.map(value => this.getLayoutFromPartial(value)) : [],
            finalLayout: <never>{},
            width: partialLayout.width == undefined ? 0 : partialLayout.width,
            height: partialLayout.height == undefined ? 0 : partialLayout.height,
            left: partialLayout.left == undefined ? 0 : partialLayout.left,
            top: partialLayout.top == undefined ? 0 : partialLayout.top,
            padding: partialLayout.padding == undefined ? {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            } : partialLayout.padding,
            sortBy: partialLayout.sortBy ? partialLayout.sortBy : "horizontal",
            display: partialLayout.display ? partialLayout.display : "table",
            scaleBy: partialLayout.scaleBy ? partialLayout.scaleBy : "both",
            align: partialLayout.align ? partialLayout.align : "tl",
            alignIn: partialLayout.alignIn ? partialLayout.alignIn : "tl",
            avoidBounding: partialLayout.avoidBounding ? partialLayout.avoidBounding : "no",
        };
        layout.finalLayout = layout.finalLayout ?? <unknown>{};
        return layout;
    }

    update(gameSize:LayoutGameSize) {
        const aspect = gameSize.width / gameSize.height;
        const layouts = this.layouts.map(layout => {
            layout = this.applyAspect(layout, aspect);
            return this.calculateLayout(Object.assign(gameSize, {x: 0, y: 0}), layout);
        });
        this.plugins.forEach(value => value.beforeUpdate());
        this.plugins.forEach(value => layouts.forEach(value1 => value.update(value1)));
        this.plugins.forEach(value => value.afterUpdate());
    }

    private calculateLayout(layoutSize:LayoutSize, layout:Layout):Layout {
        if (typeof layout.width == "number") {
            layout.finalLayout.width = layout.width;
        } else if (typeof layout.width == "string") {
            layout.finalLayout.width = layoutSize.width * parseFloat(layout.width) / 100;
        }
        if (typeof layout.height == "number") {
            layout.finalLayout.height = layout.height;
        } else if (typeof layout.height == "string") {
            layout.finalLayout.height = layoutSize.height * parseFloat(layout.height) / 100;
        }
        this.calculateLayoutLeftPosition(layout, layoutSize);
        this.calculateLayoutTopPosition(layout, layoutSize);
        const sortByHorizontal = layout.sortBy == "horizontal";
        const sortByVertical = layout.sortBy == "vertical";
        switch (layout.display) {
            case "table": {
                layout.layouts.forEach((value, i, arr) => this.calculateLayout({
                    width: layout.finalLayout.width / (sortByHorizontal ? arr.length : 1),
                    height: layout.finalLayout.height / (sortByVertical ? arr.length : 1),
                    x: layout.finalLayout.x + (sortByHorizontal ? i * layout.finalLayout.width / arr.length : 0),
                    y: layout.finalLayout.y + (sortByVertical ? i * layout.finalLayout.height / arr.length : 0),
                }, value));
                break;
            }
            case "fixed": {
                layout.layouts.forEach(value => this.calculateLayout({
                    width: layout.finalLayout.width,
                    height: layout.finalLayout.height,
                    x: layout.finalLayout.x,
                    y: layout.finalLayout.y,
                }, value));
                break;
            }
            case "relative": {
                const finalLayout:LayoutSize = {
                    x: layout.finalLayout.x,
                    y: layout.finalLayout.y,
                    width: layout.finalLayout.width,
                    height: layout.finalLayout.height,
                };
                layout.layouts.forEach(value => {
                    const childLayoutSize = {
                        width: finalLayout.width /* / (sortByHorizontal?arr.length:1)*/,
                        height: finalLayout.height /* / (sortByVertical?arr.length:1)*/,
                        x: finalLayout.x /* + (sortByHorizontal?i * finalLayout.width / arr.length:0)*/,
                        y: finalLayout.y /* + (sortByVertical?i * finalLayout.height / arr.length:0)*/,
                    };
                    this.calculateLayout(childLayoutSize, value);
                    finalLayout.width -= (sortByHorizontal && !(typeof value.width === "string")) ? value.finalLayout.width : 0;
                    finalLayout.height -= sortByVertical&& !(typeof value.height === "string") ? value.finalLayout.height - (childLayoutSize.y - value.finalLayout.y) : 0;
                    finalLayout.x += sortByHorizontal ? value.finalLayout.width : 0;
                    finalLayout.y += sortByVertical ? (value.finalLayout.y - childLayoutSize.y) + value.finalLayout.height : 0;
                });
                break;
            }
        }
        return layout;
    }

    private calculateLayoutTopPosition(layout:Layout, layoutSize:LayoutSize) {
        const layoutTop = this.getLayoutTopPosition(layout, layoutSize);
        switch (layout.align) {
            case "bl":
            case "br":
            case "b":
                layout.finalLayout.y = layoutSize.y + (layoutSize.height - layout.finalLayout.height) + layoutTop;
                break;
            case "tl":
            case "tr":
            case "t":
                layout.finalLayout.y = layoutSize.y + layoutTop;
                break;
            case "r":
            case "l":
            case "c":
                layout.finalLayout.y = layoutSize.y + (layoutSize.height - layout.finalLayout.height) / 2 + layoutTop;
                break;
        }
    }

    private calculateLayoutLeftPosition(layout:Layout, layoutSize:LayoutSize) {
        const layoutLeft = this.getLayoutLeftPosition(layout, layoutSize);
        switch (layout.align) {
            case "tr":
            case "br":
            case "r":
                layout.finalLayout.x = layoutSize.x + (layoutSize.width - layout.finalLayout.width) + layoutLeft;
                break;
            case "tl":
            case "bl":
            case "l":
                layout.finalLayout.x = layoutSize.x + layoutLeft;
                break;
            case "b":
            case "t":
            case "c":
                layout.finalLayout.x = layoutSize.x + (layoutSize.width - layout.finalLayout.width) / 2 + layoutLeft/* + layoutLeft*/;
                break;
        }
    }

    protected getLayoutTopPosition(layout:Layout, layoutSize:LayoutSize) {
        let result = 0;
        if (typeof layout.top == "number") {
            result = layout.top;
        } else if (typeof layout.top == "string") {
            result = layoutSize.height * parseFloat(layout.top) / 100;
        }
        return result;
    }

    protected getLayoutLeftPosition(layout:Layout & LayoutName & Layouts, layoutSize:LayoutSize) {
        let result = 0;
        if (typeof layout.left == "number") {
            result = layout.left;
        } else if (typeof layout.left == "string") {
            result = layoutSize.width * parseFloat(layout.left) / 100;
        }
        return result;
    }

    addPlugin(plugin:LayoutPlugin) {
        this.plugins.push(plugin);
        this.applicationUpdateRequest();
    }

    hasPlugin(plugin:LayoutPlugin):boolean {
        return this.plugins.indexOf(plugin) >= 0;
    }

    removePlugin(plugin:LayoutPlugin) {
        while (this.hasPlugin(plugin)) {
            const indexOf = this.plugins.indexOf(plugin);
            this.plugins.splice(indexOf, 1);
        }
        plugin.dispose();
    }

    protected extendLayout(partialLayout:PartialLayout, baseLayout:PartialLayout) {
        partialLayout.align = partialLayout.align ?? baseLayout.align;
        partialLayout.alignIn = partialLayout.alignIn ?? baseLayout.alignIn;
        partialLayout.avoidBounding = partialLayout.avoidBounding ?? baseLayout.avoidBounding;
        partialLayout.display = partialLayout.display ?? baseLayout.display;
        partialLayout.height = partialLayout.height ?? baseLayout.height;
        partialLayout.left = partialLayout.left ?? baseLayout.left;
        partialLayout.padding = partialLayout.padding ?? baseLayout.padding;
        partialLayout.scaleBy = partialLayout.scaleBy ?? baseLayout.scaleBy;
        partialLayout.sortBy = partialLayout.sortBy ?? baseLayout.sortBy;
        partialLayout.top = partialLayout.top ?? baseLayout.top;
        partialLayout.width = partialLayout.width ?? baseLayout.width;
        partialLayout.aspects = partialLayout.aspects ?? baseLayout.aspects;
        // todo: support child nodes extending [#39]
        // partialLayout.layouts = baseLayout.layouts ?? partialLayout.layouts;
    }

    protected overrideLayout(partialLayout:Layout, baseLayout:Partial<PartialLayout>, clone = true):Layout {
        let result:Layout;
        if (clone) {
            result = {...partialLayout};
            if (partialLayout.layouts) {
                result.layouts = [...partialLayout.layouts];
            }
        } else {
            result = partialLayout;
        }
        result.align = baseLayout.align ?? partialLayout.align;
        result.alignIn = baseLayout.alignIn ?? partialLayout.alignIn;
        result.avoidBounding = baseLayout.avoidBounding ?? partialLayout.avoidBounding;
        result.display = baseLayout.display ?? partialLayout.display;
        result.height = baseLayout.height ?? partialLayout.height;
        result.left = baseLayout.left ?? partialLayout.left;
        result.padding = baseLayout.padding ?? partialLayout.padding;
        result.scaleBy = baseLayout.scaleBy ?? partialLayout.scaleBy;
        result.sortBy = baseLayout.sortBy ?? partialLayout.sortBy;
        result.top = baseLayout.top ?? partialLayout.top;
        result.width = baseLayout.width ?? partialLayout.width;
        return result;
    }

    private applyAspect(layout:Layout, aspect:number):Layout {
        const aspects = <AspectLayoutKey[]>Object.keys(layout.aspects);
        let result = layout;
        if (aspects.length != 0) {
            const aspectKey = this.getAspectKey(aspects, aspect);
            const aspectLayout = layout.aspects[<AspectLayoutKey>aspectKey];
            result = this.overrideLayout(layout, aspectLayout);
        }
        if (result.layouts.length) {
            result.layouts = result.layouts.map(value => this.applyAspect(value, aspect));
        }
        return result;
    }

    public getAspectKey(aspects: AspectLayoutKey[], aspect: number) {
        let aspectKey = aspects[0];
        aspects.forEach(value => {
            const actualAspect = Math.abs(parseFloat(eval(aspectKey)) - aspect);
            const newAspect = Math.abs(parseFloat(eval(value)) - aspect);
            if (newAspect < actualAspect) {
                aspectKey = value;
            }
        });
        return aspectKey;
    }
}
