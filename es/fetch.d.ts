export interface HttpBaseOptions {
    baseUrl?: string;
    successfulStatusCode?: number[];
    logoutStatusCodes?: number[];
    silentErrorCodes?: number[];
    blobFileTypes?: string[];
    globalHeaders?: Record<string, unknown> | (() => Record<string, unknown>);
    handleNotification?: ((result: any) => void) | undefined;
    handleLogout?: ((result: any) => void) | undefined;
}
declare class HttpBase {
    baseUrl: string;
    blobFileTypes: string[];
    successfulStatusCode: number[];
    logoutStatusCodes: number[];
    silentErrorCodes: number[];
    globalHeaders: Record<string, unknown> | (() => Record<string, unknown>);
    handleNotification?: ((result: any) => void) | undefined;
    handleLogout?: ((result: any) => void) | undefined;
    constructor(options?: HttpBaseOptions);
}
export default class HttpRequest extends HttpBase {
    static createUrl(url: string, baseUrl: string): string;
    post(url: string, body: any, headers?: any, autoAlertError?: boolean): Promise<unknown>;
    static isFormData(body: unknown): boolean;
}
export declare const downloadfile: (response: any) => void;
export {};
