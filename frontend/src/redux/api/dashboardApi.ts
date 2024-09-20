import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashBoardResponseType } from "../../types/api-types";


export const dashboardAPI = createApi({
    reducerPath: "dashboardAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard` }),
    endpoints: (builder) => {
        return {
            stats: builder.query<DashBoardResponseType, string>({
                query: (id) => `/stats?id=${id}`
            }),
            pie: builder.query<DashBoardResponseType, string>({
                query: (id) => `/pie?id=${id}`
            }),
            bar: builder.query<DashBoardResponseType, string>({
                query: (id) => `/bar?id=${id}`
            }),
            line: builder.query<DashBoardResponseType, string>({
                query: (id) => `/line?id=${id}`
            }),
        }
    }
})

export const {useStatsQuery, usePieQuery, useLineQuery, useBarQuery } = dashboardAPI

