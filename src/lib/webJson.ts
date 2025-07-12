export function successResponse(data: object) {
    return {
        ok: true,
        data: data
    };
}

export interface errorResponseType {
    message: string;
}

export function errorResponse(error: errorResponseType) {
    return {
        ok: false,
        error: error
    }
}
