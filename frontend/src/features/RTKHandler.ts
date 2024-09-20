import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ApiErrorType, ApiResponseType } from "../types/api-types"
import { SerializedError } from "@reduxjs/toolkit"
import { NavigateFunction } from "react-router-dom"
import toast from "react-hot-toast"

type ResType = {
    data: ApiResponseType
} | {
    error: FetchBaseQueryError | SerializedError
}

export const responseToast = (
    response: ResType,
    navigate: NavigateFunction | null,
    url: string
) => {
    if ("data" in response) {
        toast.success(response.data.message)
        if (navigate) navigate(url)
    } else {
        const error = response.error as ApiErrorType
        toast.error(error.data.message)
    }
}