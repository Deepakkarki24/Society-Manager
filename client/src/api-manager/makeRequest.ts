// import { VITE_API_URL } from "@/config/env";
import api from "@/api-manager/apiInterceptor"
import type { AxiosError, AxiosRequestConfig } from "axios";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class MakeRequest {
    static async axiosRequest(method: HttpMethod, url: string, data?: object, params?: object) {

        // const BASE_URL = VITE_API_URL;
        // url = BASE_URL + url;

        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            params
        }
        try {
            const response = await api(config);
            return {
                success: true,
                data: response.data as object
            };
        } catch (e: unknown) {
            const error = e as AxiosError;
            const messsage = (error.response?.data as { message: '' })?.message || '';
            const errObject = (error.response?.data as { error: any })?.error || '';

            console.log(messsage);
            return {
                success: false,
                message: messsage,
                error: errObject
            };
        }
    }

    static get = (url: string, params?: object) => {
        return this.axiosRequest('GET', url, undefined, params);
    }

    static post = (url: string, data: object) => {
        return this.axiosRequest('POST', url, data);
    }

    static put = (url: string, data: object) => {
        return this.axiosRequest('PUT', url, data);
    }

    static patch = (url: string, data?: object, params?: object) => {
        return this.axiosRequest('PATCH', url, data, params);
    }

    static delete = (url: string, params?: object) => {
        return this.axiosRequest('DELETE', url, undefined, params);
    }

}

export default MakeRequest;