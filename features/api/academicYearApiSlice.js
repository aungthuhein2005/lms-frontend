import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const academicYearApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    reducerPath: "academicYearApi",
    endpoints: (builder) => ({
        getAcademicYears: builder.query({
            query: () => "/academic-years",
            providesTags: ["AcademicYear"],
        }),
        getAcademicYearById: builder.query({
            query: (id) => `/academic-years/${id}`,
        }),
        addAcademicYear: builder.mutation({
            query: (academicYearData) => ({
                url: "/academic-years",
                method: "POST",
                body: academicYearData,
            }),
            invalidatesTags: ["AcademicYear"],
        }),
        updateAcademicYear: builder.mutation({
            query: ({ id, ...academicYearData }) => ({
                url: `/academic-years/${id}`,
                method: "PUT",
                body: academicYearData,
            }),
        }),
        deleteAcademicYear: builder.mutation({
            query: (id) => ({
                url: `/academic-years/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AcademicYear"],
        }),
    }),
})

export const {
    useGetAcademicYearsQuery,
    useGetAcademicYearByIdQuery,
    useAddAcademicYearMutation,
    useUpdateAcademicYearMutation,
    useDeleteAcademicYearMutation,
} = academicYearApiSlice;