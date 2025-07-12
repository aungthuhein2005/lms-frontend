import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const semesterServiceApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    reducerPath: "semesterServiceApi",
    endpoints: (builder) => ({
        getSemestersByAcademicYearId: builder.query({
            query: (academicYearId) => `/semesters/academic_year/${academicYearId}`,
            providesTags: ["Semester"],
        }),
        getSemesters: builder.query({
            query: () => "/semesters",
            providesTags: ["Semester"],
        }),
        addSemester: builder.mutation({
            query: (semesterData) => ({
                url: "/semesters",
                method: "POST",
                body: semesterData,
            }),
            invalidatesTags: ["Semester"],
        }),
        updateSemester: builder.mutation({
            query: ({ id, ...semesterData }) => ({
                url: `/semesters/${id}`,
                method: "PUT",
                body: semesterData,
            }),
            invalidatesTags: ["Semester"],
        }),
        deleteSemester: builder.mutation({
            query: (id) => ({
                url: `/semesters/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Semester"],
        }),
    }),
})

export const {
    useGetSemestersQuery,
    useGetSemestersByAcademicYearIdQuery,
    useAddSemesterMutation,
    useUpdateSemesterMutation,
    useDeleteSemesterMutation,
} = semesterServiceApiSlice;
