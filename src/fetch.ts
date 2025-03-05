type Func = () => Record<string, any>;
type DefaultHeaders = Record<string, any> | Func | HeadersInit;
export interface RqInit {
    baseUrl?: string;
    blobFileTypes?: string[];
    successfulStatusCode?: number[];
    logoutStatusCodes?: number[];
    silentErrorCodes?: number[];
    handleError?: (response: any) => void;
    handleLogout?: (response: any) => void;
    headers?: DefaultHeaders;
    returnData?: boolean;
}
export interface RequestOptions extends RequestInit {
    json?: Record<string, any>;
    data?: Record<string, any>;
    closeError?: boolean;
    returnData?: boolean;
}
export const isObject = (oj: unknown) => Object.prototype.toString.call(oj) === '[object Object]';
export const isFunction = (oj: unknown) => Object.prototype.toString.call(oj) === '[object Function]';

class Rq {
    options = {
        baseUrl: '',
        blobFileTypes: ['stream', 'excel', 'download', 'blob'],
        successfulStatusCode: [200],
        logoutStatusCodes: [401, 402, 403],
        silentErrorCodes: [],
        handleLogout: undefined,
        handleError: undefined,
        headers: undefined,
        returnData: true,
    } as RqInit;
    constructor(options?: RqInit) {
        if (options) {
            this.options = Object.assign(this.options, options);
        }
    }
    static create(options: RqInit) {
        return new Rq(options);
    }
    config(options: RqInit) {
        if (!isObject(options)) throw new Error('options must be object {}');
        this.options = Object.assign(this.options, options);
    }
    createUrl(url: string) {
        if (typeof url !== 'string') {
            throw new Error('url must be string');
        }
        return `${this.options.baseUrl}${url}`;
    }

    createQueryUrl(url: string, query: Record<string, string>) {
        let queryStr: any = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }
            queryStr.append(key, value);
        });
        queryStr = queryStr.toString();
        if (url.includes('?')) {
            if (url.endsWith('&')) {
                return `${url}${queryStr}`;
            }
            return `${url}&${queryStr}`;
        }
        return `${url}?${queryStr}`;
    }

    handleDefaultHeader() {
        let defaultHeaders = this.options.headers;
        if (isFunction(defaultHeaders)) defaultHeaders = (defaultHeaders as Func)();
        const headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
        if (isObject(defaultHeaders)) {
            Object.entries(defaultHeaders).forEach(([key, value]) => {
                headers.set(key, value as string);
            });
        }
        return headers;
    }

    async request(url: string, options?: RequestOptions) {
        if (!options) options = {};
        const headers = this.handleDefaultHeader();
        options.headers = new Headers({ ...Object.fromEntries(headers), ...options.headers });
        options.method = options.method ?? 'POST';

        url = this.createUrl(url);
        if (['GET', 'HEAD'].includes(options.method.toUpperCase())) {
            if (options.json && isObject(options.json)) {
                url = this.createQueryUrl(url, options.json as Record<string, string>);
            }
        } else {
            if (options.json) {
                if (options.json instanceof FormData) {
                    options.headers.delete('Content-Type');
                    options.body = options.json;
                    delete options.headers['Content-Type'];
                } else {
                    options.body = JSON.stringify(options.json);
                    options.json = undefined;
                }
            } else {
                if (options.body && options.json instanceof FormData) {
                    delete options.headers['Content-Type'];
                }
            }
        }
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(response.statusText);
            const contentType = (response.headers.get('content-type') || '').toLocaleLowerCase();

            if (this.options.blobFileTypes.some(it => contentType.includes(it))) {
                const blob = await response.blob();
                return { code: 200, data: blob, response };
            }

            const data = await response.json();

            if (this.options.successfulStatusCode.includes(data?.code)) {
                if (this.options.returnData === false || options.returnData === false) {
                    return data;
                } else {
                    return data.hasOwnProperty('data') ? data.data : data;
                }
            }

            if (options.closeError || this.options.successfulStatusCode.includes(data?.code)) {
                return Promise.reject(data);
            }

            if (this.options.logoutStatusCodes.includes(data?.code)) {
                this.options.handleLogout?.(data);
            }

            this.options.handleError?.(data);
            return Promise.reject(data)
        } catch (error) {
            this.options.handleError?.(error);
            return Promise.reject(error);
        }

    }
}



//use response download 
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

export default Rq;