export interface SpineData {
    skeleton: {
        hash: string, spine: string,
        x: number, y: number,
        width: number, height: number,
        images: string, audio: string
    };
    bones: [];
    slots: [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skins: [{ attachments?: any }];
    animations: {
        animation: {
            slots: NonNullable<unknown>,
            bones: NonNullable<unknown>
        }
    }
}
