class GameLocalStorage {
    constructor(private gameName: string) {}

    getItem(key: string): string | null {
        const fullKey = `${this.gameName}.${key}`;
        return window.localStorage.getItem(fullKey);
    }

    setItem(key: string, value: string): void {
        const fullKey = `${this.gameName}.${key}`;
        window.localStorage.setItem(fullKey, value);
    }

    removeItem(key: string): void {
        const fullKey = `${this.gameName}.${key}`;
        window.localStorage.removeItem(fullKey);
    }
    /**
     * @deprecated removes all other games values
     */
    clear(): void {
        window.localStorage.clear();
    }
}

const gameLocalStorage = new GameLocalStorage("country-adventures");
export default gameLocalStorage;
