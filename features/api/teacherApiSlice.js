import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teacherApiSlice = createApi({
    baseQuery: fetchBaseQuery({'baseUrl': "http://localhost:8080/teachers"}),
    reducerPath: 'teacherApi',
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: () => '',
            providesTags: ['Teacher']
        }),
        getTeacherById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Teacher', id }]
        }),
        createTeacher: builder.mutation({
            query: (newTeacher) => ({
                url: '/',
                method: 'POST',
                body: newTeacher
            }),
            invalidatesTags: ['Teacher']
        }),
        updateTeacher: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: updatedData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Teacher', id }]
        }),
        deleteTeacher: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Teacher']
        })
    })
})

export const {
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation
} = teacherApiSlice;