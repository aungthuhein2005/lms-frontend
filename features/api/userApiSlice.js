import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
    baseQuery: fetchBaseQuery({'baseUrl': "http://localhost:8080"}),
    reducerPath: "userApi",
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["Users"],
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
        }),
        addUser: builder.mutation({
            query: (userData) => ({
                url: "/users",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Users"],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: userData,
            }),
        }),
         checkDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    forceDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/force`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useCheckDeleteUserMutation,
    useForceDeleteUserMutation,
} = userApiSlice;