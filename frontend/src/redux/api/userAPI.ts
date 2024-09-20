import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType, } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";


export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user` }),
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            login: builder.mutation<ApiResponseType, User>({
                query: (user) => {
                    return {
                        url: "/new",
                        method: "POST",
                        body: user
                    }
                }
            }),
            allUsers: builder.query<ApiResponseType, string>({
                query: (id) => `/all?id=${id}`,
                providesTags: ["user"]
            }),
            deleteUser: builder.mutation<ApiResponseType, { id: string, uid: string }>({
                query: ({ id, uid }) => {
                    return {
                        url: `/${uid}?id=${id}`,
                        method: "DELETE"
                    }
                },
                invalidatesTags: ["user"]
            })
        }
    }
})

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI

export const getUser = async (id: string) => {
    try {
        const { data }: { data: ApiResponseType } = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`)
        // axios.get returns a object. the object has key data which holds the ApiResponse sent from backend
        // The ApiResponse has data, and the data has user
        return data.data.user
    } catch (error) {
        throw error
    }
}