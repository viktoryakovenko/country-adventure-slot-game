type TLocales = Parameters<typeof Intl.NumberFormat>[0];
type TOptions = Parameters<typeof Intl.NumberFormat>[1];
export default class CurrencyFormatterHelper {
    private static locales: TLocales = "en-US";
    private static readonly options: TOptions = {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        useGrouping: true,
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    public static format(
        value: number,
        options: Partial<TOptions> = this.options,
    ): string {
        const newOptions = {
            ...this.options,
            ...options,
        };
        return new Intl.NumberFormat(this.locales, newOptions).format(value);
    }
}
