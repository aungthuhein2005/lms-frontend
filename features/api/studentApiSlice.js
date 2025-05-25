import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentApiSlice = createApi({
    reducerPath: "studentApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: () => "/students",
            providesTags: ["Students"],
        }),
        getStudentById: builder.query({
            query: (id) => `/students/${id}`,
        }),
        addStudent: builder.mutation({
            query: (student) => ({
                url: "/students",
                method: "POST",
                body: student,
            }),
            invalidatesTags: ["Students","Users"],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...student }) => ({
                url: `/students/${id}`,
                method: "PUT",
                body: student,
            }),
        }),
        softDeleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/soft_delete/${id}`,
                method: "PATCH",
            }),
        }),
        restoreStudent: builder.mutation({
            query: (id) => ({
                url: `/students/restore/${id}`,
                method: "PATCH",
            }),
        }),
        assignToClass: builder.mutation({
            query: ({ studentId, classId }) => ({
                url: `/students/assign_to_class`,
                method: "POST",
                body: { studentId, classId },
            }),
        }),
        getAssignedClasses: builder.query({
            query: (studentId) => `/students/assigned_classes/${studentId}`,
        }),
    }),
});

export const {
    useGetStudentsQuery,
    useGetStudentByIdQuery,
    useAddStudentMutation,
    useUpdateStudentMutation,
    useSoftDeleteStudentMutation,
    useRestoreStudentMutation,
    useAssignToClassMutation,
    useGetAssignedClassesQuery,
} = studentApiSlice;
export default studentApiSlice.reducer;
