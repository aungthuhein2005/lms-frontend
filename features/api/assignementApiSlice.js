import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const assignmentApi = createApi({
    reducerPath: 'assignmentApi',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/assignments" }),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({
        getAssignments: builder.query({
            query: () => '',
            providesTags: (result = [], error, arg) =>
                result
                    ? [
                            ...result.map(({ id }) => ({ type: 'Assignment', id })),
                            { type: 'Assignment', id: 'LIST' },
                        ]
                    : [{ type: 'Assignment', id: 'LIST' }],
        }),
        getAssignmentById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Assignment', id }],
        }),
        getAssignmentsByStudentId: builder.query({
  query: (studentId) => `/student/${studentId}`,
  providesTags: (result, error, id) => [{ type: "Assignment", id }],
}),

        addAssignment: builder.mutation({
            query: (newAssignment) => ({
                url: '/',
                method: 'POST',
                body: newAssignment,
            }),
            invalidatesTags: [{ type: 'Assignment', id: 'LIST' }],
        }),
        updateAssignment: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }],
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Assignment', id },
                { type: 'Assignment', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetAssignmentsQuery,
    useGetAssignmentByIdQuery,
    useAddAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
    useGetAssignmentsByStudentIdQuery
} = assignmentApi;