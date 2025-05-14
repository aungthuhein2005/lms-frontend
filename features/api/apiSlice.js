import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/users",
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
        }),
        getStudents: builder.query({
            query: () => "/students",
        }),
        getStudentById: builder.query({
            query: (id) => `/students/${id}`,
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetStudentsQuery,   // Make sure this is here!
    useGetStudentByIdQuery,
} = apiSlice;
export default apiSlice.reducer