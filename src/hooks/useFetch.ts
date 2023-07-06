import type { Options, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest } from 'ahooks'
// import { message } from 'antd'
import { default as HttpRequest, downloadfile, HttpBaseOptions } from '../fetch'

export interface UseFetchOptions extends Options<Record<string, unknown>, any[]> {
    data?: Record<string, unknown>;
    autoAlertError?: boolean;
    fetchOptions?: RequestInit;
}

const defaultOptions: HttpBaseOptions = {
    baseUrl: '/api',
    successfulStatusCode: [200,],
    logoutStatusCodes: [401, 402],
    silentErrorCodes: [],
    blobFileTypes: ['stream', 'excel', 'download', 'blob'],
    globalHeaders: () => ({
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': localStorage.getItem('token')
    }),
    handleNotification: (result) => {},
    // handleNotification: (result) => message.error(result.message || result.msg),
    handleLogout: undefined,
}

let http = new HttpRequest(defaultOptions);

const useFetch = (
    url: string,
    options: UseFetchOptions = {}
): Result<Record<string, unknown>, any[]> => {
    const {
        data: body,
        autoAlertError = true,
        fetchOptions,
        ...useRequestOptions
    } = options;

    const fetcher: Service<any, any> = (requestData) => {
        if (requestData?.nativeEvent) requestData = null;
        return http.post(url, requestData ?? body, fetchOptions, autoAlertError);
    };
    return useRequest(fetcher, useRequestOptions);
};  
 
//配置fetch
useFetch.config = (options: HttpBaseOptions = {}) => {
    http = new HttpRequest({
        baseUrl: options.baseUrl || defaultOptions.baseUrl,
        blobFileTypes: options.blobFileTypes || defaultOptions.blobFileTypes,
        silentErrorCodes: options.silentErrorCodes || defaultOptions.silentErrorCodes,
        logoutStatusCodes: options.logoutStatusCodes || defaultOptions.logoutStatusCodes,
        successfulStatusCode: options.successfulStatusCode || defaultOptions.successfulStatusCode,
        //function
        globalHeaders: options.globalHeaders || defaultOptions.globalHeaders,
        handleNotification: options.handleNotification || defaultOptions.handleNotification,
        handleLogout: options.handleLogout,
    })
}

export { downloadfile, http }
export default useFetch;
