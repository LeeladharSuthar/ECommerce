import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType, SearchProps } from "../../types/api-types";
import { Product } from "../../types/types";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product` }),
    tagTypes: ["latestproducts", "allProducts", "searchProducts", "categories", "productDetails"],
    endpoints: (builder) => {
        return {
            latestProducts: builder.query<ApiResponseType, string>({
                query: () => "/latest",
                providesTags: ["latestproducts"]
            }),
            allProducts: builder.query<ApiResponseType, string>({
                query: (id) => `/all?id=${id}`,
                providesTags: ["allProducts"]
            }),
            categories: builder.query<ApiResponseType, string>({
                query: () => `/category`,
                providesTags: ["categories"]
            }),
            searchProducts: builder.query<ApiResponseType, SearchProps>({
                query: ({ category, price, search, sort, page }) => {
                    let url = `/search?`
                    if (search)
                        url += `search=${search}&`
                    if (price)
                        url += `price=${price}&`
                    if (sort)
                        url += `sort=${sort}&`
                    if (category)
                        url += `category=${category}&`
                    if (page)
                        url += `page=${page}`
                    return url
                },
                providesTags: ["searchProducts"]
            }),
            productDetails: builder.query<ApiResponseType, string>({
                query: (id) => `/${id}`,
                providesTags: ["productDetails"]
            }),
            newProduct: builder.mutation<ApiResponseType, { formData: FormData, id: string }>({
                query: ({ formData, id }) => {
                    return {
                        url: `/new?id=${id}`,
                        method: "POST",
                        body: formData
                    }
                },
                invalidatesTags: ["latestproducts", "allProducts", "searchProducts", "categories"],
            }),
            updateProduct: builder.mutation<ApiResponseType, { formData: FormData, uid: string, pid: string }>({
                query: ({ formData, uid, pid }) => {
                    return {
                        url: `/${pid}?id=${uid}`,
                        method: "PUT",
                        body: formData
                    }
                },
                invalidatesTags: ["latestproducts", "allProducts", "searchProducts", "categories", "productDetails"]
            }),
            deleteProduct: builder.mutation<ApiResponseType, {id: string, uid: string}>({
                query: ({id, uid}) => {
                    return {
                        url: `/${id}?id=${uid}`,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["latestproducts", "allProducts", "searchProducts", "categories"]
            }),
        }
    }
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useProductDetailsQuery, useNewProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productAPI

