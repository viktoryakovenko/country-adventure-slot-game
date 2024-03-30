declare type BuildType = "DEV" | "STAGE" | "PROD";
declare type ServerType = "scgs" | "legacy";
declare const X_API_VERSION: string;
declare const BUILD_TYPE: BuildType;
declare const CREDENTIALS: RequestCredentials;
declare const SERVER_TYPE: ServerType;
declare const SERVER_URL: string;
declare const EXTERNAL_USER_SERVICE_URL: string;
declare const __DEV__: boolean;
declare const VERSION: string;
declare module "*.vert" {
    const content: string;
    export default content;
}

declare module "*.frag" {
    const content: string;
    export default content;
}
