import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType } from "../../types/api-types";
import { NewOrderResponse } from "../../types/types";

export const orderAPI = createApi({
    reducerPath: "orderAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order` }),
    tagTypes: ["AllOrders", "process"],
    endpoints: (builder) => {
        return {
            newOrder: builder.mutation<ApiResponseType, NewOrderResponse>({
                query: (order) => {
                    return {
                        url: `/new`,
                        method: "POST",
                        body: order
                    }
                },
                invalidatesTags:["AllOrders"]
            }), 
            myOrders: builder.query<ApiResponseType, string>({
                query: (id) => `/myOrders?id=${id}`,
            }),
            allOrders: builder.query<ApiResponseType, string>({
                query: (id) => `/allOrders?id=${id}`,
                providesTags: ["AllOrders"]
            }),
            orderDetails: builder.query<ApiResponseType, string>({
                query: (id) => `/${id}`,
                providesTags: ["process"]
            }),
            processOrder: builder.mutation<ApiResponseType, { id: string, uid: string }>({
                query: ({ id, uid }) => {
                    return {
                        url: `/process/${id}?id=${uid}`,
                        method: "PUT",
                    }
                },
                invalidatesTags: ["process"]
            }),
            deleteOrder: builder.mutation<ApiResponseType, { id: string, uid: string }>({
                query: ({ id, uid }) => {
                    return {
                        url: `/${id}?id=${uid}`,
                        method: "DELETE",
                    }
                }
            }),
        }
    }
})

export const { useNewOrderMutation, useMyOrdersQuery, useAllOrdersQuery, useOrderDetailsQuery, useProcessOrderMutation, useDeleteOrderMutation } = orderAPI

