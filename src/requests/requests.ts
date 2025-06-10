import { removeObject, getRemoveObjectResult, getHistoryList } from './apis';

const BASE_URL = 'https://api.fujie.com/v1';

export interface FJResponse<T> {
    code?: number;
    msg?: string;
    data?: T;
    token?: string;
}

export interface RemoveObjectRequest {
    // s3 url
    image: string;
    // base64
    mask: string;
}

export interface RemoveObjectResponse {
    event_id?: string;
}
export interface RemoveObjectResultResponse {
    code?: number;
    message?: string;
    data?: {
        job_state?: string;
        progress?: string;
        out_put?: Array<{
            id?: string;
            result?: string;
            has_watermark?: string;
            original?: string;
            info?: string;
            style?: string;
        }>;
    };
}

export interface GetHistoryListResponse {
    id?: string;
    user_id?: string;
    event_id?: string;
    original?: string;
    result?: string;
    job_type?: string;
    has_watermark?: string;
    created_at?: string;
    info?: string;
    style?: string;
}

export const removeObjectRequest = (data: RemoveObjectRequest): Promise<FJResponse<RemoveObjectResponse>> => {
    return fetch(`${BASE_URL}/${removeObject()}`, {
        method: 'POST',
        body: JSON.stringify(data),
    }) as unknown as Promise<FJResponse<RemoveObjectResponse>>;
};

export const getRemoveObjectResultRequest = (event_id: string): Promise<FJResponse<RemoveObjectResultResponse>> => {
    return fetch(`${BASE_URL}/${getRemoveObjectResult()}`, {
        method: 'POST',
        body: JSON.stringify({ event_id }),
    }) as unknown as Promise<FJResponse<RemoveObjectResultResponse>>;
};

export const getHistoryListRequest = (event_type: string): Promise<FJResponse<GetHistoryListResponse[]>> => {
    return fetch(`${BASE_URL}/${getHistoryList()}`, {
        method: 'POST',
        body: JSON.stringify({ event_type }),
    }) as unknown as Promise<FJResponse<GetHistoryListResponse[]>>;
};
