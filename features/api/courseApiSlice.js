import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
    reducerPath: "courseApi",
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => "/courses/all",
            providesTags: ["Courses"],
        }),
        getCourseById: builder.query({
            query: (id) => `/courses/${id}`,
        }),
        addCourse: builder.mutation({
            query: (courseData) => ({
                url: "/courses",
                method: "POST",
                body: courseData,
            }),
            invalidatesTags: ["Courses"],
        }),
        updateCourse: builder.mutation({
            query: ({ id, ...courseData }) => ({
                url: `/courses/${id}`,
                method: "PUT",
                body: courseData,
            }),
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Courses"],
        }),
        getRecentCourses: builder.query({
            query: () => "/courses/recent",
            providesTags: ["RecentCourses"],
        }),
    }),
})
export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useAddCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetRecentCoursesQuery,
} = courseApiSlice;