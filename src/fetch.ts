export interface HttpBaseOptions {
    baseUrl?: string; // 基础 URL
    successfulStatusCode?: number[]; // 成功的 HTTP 状态码 
    logoutStatusCodes?: number[]; // 需要退出登录的 HTTP 状态码
    silentErrorCodes?: number[]; // 静默处理的 HTTP 状态码
    blobFileTypes?: string[]; // Blob 文件类型
    globalHeaders?: Record<string, unknown> | (() => Record<string, unknown>); // 全局请求头
    handleNotification?: ((result: any) => void) | undefined; // 处理通知的回调函数
    handleLogout?: ((result: any) => void) | undefined; // 处理退出登录的回调函数
}

class HttpBase {
    baseUrl: string;
    blobFileTypes: string[];
    successfulStatusCode: number[];
    logoutStatusCodes: number[];
    silentErrorCodes: number[];
    globalHeaders: Record<string, unknown> | (() => Record<string, unknown>);
    handleNotification?: ((result: any) => void) | undefined;
    handleLogout?: ((result: any) => void) | undefined;
    constructor(options: HttpBaseOptions = {}) {
        this.baseUrl = options.baseUrl || '/api';
        this.successfulStatusCode = options.successfulStatusCode || [200];
        this.logoutStatusCodes = options.logoutStatusCodes || [401, 402, 403];
        this.silentErrorCodes = options.silentErrorCodes || [];
        this.blobFileTypes = options.blobFileTypes || ['stream', 'excel', 'download', 'blob'];
        this.globalHeaders = options.globalHeaders || {
            'Content-Type': 'application/json;charset=UTF-8',
        };
        this.handleNotification = options.handleNotification;
        this.handleLogout = options.handleLogout;
    }
}

export default class HttpRequest extends HttpBase {
    static createUrl(url: string, baseUrl: string) {
        if (typeof url !== 'string') return baseUrl;
        if (!url.startsWith('/')) {
            url = `/${url}`
        }
        return `${baseUrl}${url}`;
    }

    post(url: string, body: any, headers: any = {}, autoAlertError = true) {
        const isFormData = HttpRequest.isFormData(body);
        const globalHeaders = typeof this.globalHeaders === 'function' ? this.globalHeaders() : this.globalHeaders
        headers = Object.assign({}, globalHeaders, headers);
        if (isFormData) delete headers['Content-Type'];
        let currentResponse: Response;
        return new Promise((resolve, reject) => {
            fetch(HttpRequest.createUrl(url, this.baseUrl), {
                method: 'POST',
                headers,
                body: isFormData ? body : JSON.stringify(body),
            }).then((response: Response) => {
                currentResponse = response;
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const contentType = (response.headers.get('content-type') || '').toLocaleLowerCase();
                if (this.blobFileTypes.some(it => contentType.includes(it))) {
                    return response.blob();
                }
                return response.json();
            }).then((result) => {
                if (result instanceof Blob) {
                    return resolve({
                        code: this.successfulStatusCode,
                        data: result,
                        headers: currentResponse.headers,
                    });
                }
                const { code, data, } = result;
                //成功
                if (this.successfulStatusCode.includes(code)) {
                    return resolve(data);
                }
                //退出
                if (this.logoutStatusCodes.includes(code)) {
                    this.handleLogout?.(result)
                    return reject(result)
                }
                //静默
                if (this.silentErrorCodes.includes(code)) {
                    return reject(result);
                }
                //全局错误通知
                if (autoAlertError) {
                    this.handleNotification?.(result);
                }
                return reject(result)

            }).catch(error => {
                this.handleNotification?.(error);
                return reject(error);
            })
        })
    }

    get(url: string, headers: any = {}, autoAlertError = true) {
        const path = HttpRequest.createUrl(url, this.baseUrl);

        return new Promise((resolve, reject) => {
            fetch(
                HttpRequest.createUrl(url, this.baseUrl),
                {
                    method: 'GET',
                    headers,
                }).then((response)=>{
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }).then((result)=>{
                    const { code, data, } = result;
                    
                }).catch((error)=>{
                    return reject(error);
                })
        })
    }

    static isFormData(body: unknown) {
        return body instanceof FormData;
    }
}

//xhr response
export const downloadfile = (response: any) => {
    const filename = decodeURIComponent((response.headers.get('content-disposition') || '').split('filename=')[1])?.replaceAll('"', '');
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}