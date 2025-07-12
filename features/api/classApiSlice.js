import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classApiSlice = createApi({
    reducerPath: "classApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    endpoints: (builder) => ({
        getClasses: builder.query({
            query: () => "/classes/all",
            providesTags: (result) =>
    result
      ? [{ type: "Class", id: "LIST" }]
      : [{ type: "Class", id: "LIST" }],
        }),
        getClassById: builder.query({
            query: (id) => `/classes/${id}`,
        }),
        getRecentClasses: builder.query({
  query: () => "/classes/recent",
  providesTags: [{ type: "Class", id: "RECENT" }],
}),

        getClassByTeacherId: builder.query({
            query: (teacherId) => `/classes/teacher/${teacherId}`,
            providesTags: (result, error, teacherId) => 
                result
                    ? [{ type: "Class", id: `TEACHER_${teacherId}` }]
                    : [{ type: "Class", id: `TEACHER_${teacherId}` }],
        }),
        getClassByStudentId: builder.query({
            query: (studentId) => `/classes/student/${studentId}`,
            providesTags: (result, error, studentId) => 
                result
                    ? [{ type: "Class", id: `STUDENT_${studentId}` }]
                    : [{ type: "Class", id: `STUDENT_${studentId}` }],
}),
        addClass: builder.mutation({
            query: (classData) => ({
                url: "/classes/create",
                method: "POST",
                body: classData,
            }),
            invalidatesTags: [{ type: "Class", id: "LIST" }],
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
    useDeleteClassMutation,
    useGetClassByTeacherIdQuery,
    useGetClassByStudentIdQuery,
    useGetRecentClassesQuery,
} = classApiSlice;