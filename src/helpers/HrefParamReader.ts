export class HrefParamReader {
    protected readonly searchParams: URLSearchParams;

    constructor(href?: string) {
        const params = (href ?? window.location.href).replace(/.*\?/, "");
        this.searchParams = new URLSearchParams(params);
    }

    has(urlParam: string) {
        return this.searchParams.get(urlParam) != null;
    }

    get(urlParam: string, defaultResult?: string): string {
        const result = (this.searchParams.get(urlParam)) ?? defaultResult;
        if (!result) {
            throw new Error(`urlParam[${urlParam}] is not exist in href`);
        }
        return result;
    }
}
