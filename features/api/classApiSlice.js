import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classApiSlice = createApi({
    reducerPath: "classApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => "/classes/all",
            providesTags: ["Class"],
        }),
        getClassById: builder.query({
            query: (id) => `/classes/${id}`,
        }),
        addClass: builder.mutation({
            query: (classData) => ({
                url: "/classes/create",
                method: "POST",
                body: classData,
            }),
            invalidatesTags: ["Class"],
        }),
        updateClass: builder.mutation({
            query: ({ id, ...classData }) => ({
                url: `/classes/${id}`,
                method: "PUT",
                body: classData,
            }),
        }),
        deleteClass: builder.mutation({
            query: (id) => ({
                url: `/classes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Class"],
        }),
        softDeleteClass: builder.mutation({
            query: (id) => ({
                url: `/classes/soft_delete/${id}`,
                method: "PATCH",
            }),
        }),
        restoreClass: builder.mutation({
            query: (id) => ({
                url: `/classes/restore/${id}`,
                method: "PATCH",
            }),
        }),
    }),
});

export const {
    useGetClassesQuery,
    useGetClassByIdQuery,
    useAddClassMutation,
    useUpdateClassMutation,
    useSoftDeleteClassMutation,
    useRestoreClassMutation,
    useDeleteClassMutation
} = classApiSlice;