import ky from 'ky';
import type { Options as KyOptions, KyInstance } from 'ky';

const isObject = (oj: unknown): boolean => Object.prototype.toString.call(oj) === '[object Object]';

export interface Options extends KyOptions {
    data?: unknown;
    baseUrl?: string;
    // Blob文件类型
    blobFileTypes?: string[];
    // 成功code
    successfulStatusCode?: number[],
    // 退出code
    logoutStatusCodes?: number[],
    silentErrorCodes?: number[],
    // 自动调用错误通知
    autoAlertError?: boolean,
    // 错误通知
    handleNotification?: (response: any) => void;
    // 退出操作
    handleLogout?: (response: any) => void,
}

const createKy = (options: Options) => {
    return ky.create({
        prefixUrl: options.prefixUrl || options.baseUrl || '/api/',
        headers: options.headers || {
            'content-type': 'application/json;charset=UTF-8',
        },
        hooks: options.hooks || {
            beforeRequest: [
                (request) => {
                    request.headers.set('Authorization', localStorage.getItem('token'));
                },
            ],
        },
    })
}

class KyFetch {
    ky: KyInstance;
    options: Options;
    constructor(options: Options = {}) {
        if (!isObject(options)) throw new Error('options must be object {}');
        this.saveOptions(options);
        this.ky = createKy(options);
    }
    extend(options: Options = {}) {
        if (!isObject(options)) throw new Error('options must be object {}');
        this.saveOptions(options);
        this.ky = this.ky.extend(options);
    }
    saveOptions(options: Options) {
        this.options = options;
        this.options.timeout ??= 60000;
        this.options.successfulStatusCode ??= [200];
        this.options.silentErrorCodes ??= [];
        this.options.autoAlertError ??= true;
        this.options.logoutStatusCodes ??= [401, 402, 403];
        this.options.blobFileTypes ??= ['stream', 'excel', 'download', 'blob'];
    }
    handleUrl(url: string) {
        if (typeof url !== 'string') {
            throw new Error('url must be string');
        }
        if (url.startsWith('/')) {
            return url.substring(1);
        }
        return url;
    }

    post(url: string, options: Options) {
        return this.run(url, options, 'post')
    }
    get(url: string, options: Options) {
        return this.run(url, options, 'get')
    }
    put(url: string, options: Options) {
        return this.run(url, options, 'put')
    }
    patch(url: string, options: Options) {
        return this.run(url, options, 'patch')
    }
    head(url: string, options: Options) {
        return this.run(url, options, 'head')
    }
    delete(url: string, options: Options) {
        return this.run(url, options, 'delete')
    }
    run(url: string, options: Options, method: string) {
        url = this.handleUrl(url);
        if (options.data) {
            options.json = options.data;
            options.data = undefined;
        }
        if (options.json instanceof FormData) {
            options.body = options.json;
            options.json = undefined;
        }
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.ky[method](url, options);
                const contentType = (response.headers.get('content-type') || '').toLocaleLowerCase();
                if (this.options.blobFileTypes.some(it => contentType.includes(it))) {
                    const blob = await response.blob();
                    return resolve({
                        code: 0,
                        data: blob,
                        response,
                    })
                }
                const json: any = await response.json();
                json.response = response;
                const { code, data, } = json || {};
                //成功
                if (this.options.successfulStatusCode.includes(code)) {
                    return resolve(data);
                }
                //退出
                if (this.options.logoutStatusCodes.includes(code)) {
                    this.options.handleNotification?.(json);
                    this.options.handleLogout?.(json)
                    return reject(json)
                }
                //静默
                if (this.options.silentErrorCodes.includes(code)) {
                    return reject(json);
                }
                if (this.options.autoAlertError) {
                    this.options.handleNotification?.(json);
                }
                reject(json);
            } catch (error) {
                this.options.handleNotification?.(error);
                reject(error);
            }
        });
    }
}
export default KyFetch;

//xhr response
export const downloadfile = (res: any) => {
    let { data, headers, response } = res;
    if (!headers && response && response.headers) {
        headers = response.headers;
    }
    const filename = decodeURIComponent((headers?.get('content-disposition') || '').split('filename=')[1])?.replaceAll('"', '');
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}