import CurrencyFormatterHelper from "app/model/CurrencyFormatterHelper";

export default class CurrencyFormatter {
    formatAmount(value: number, useDecimals: boolean, currency: boolean): string {
        const style = currency ? "currency" : "decimal";
        const options = {style: style, minimumFractionDigits: useDecimals ? 2 : 0};
        return CurrencyFormatterHelper.format(value, options);
    }
}
