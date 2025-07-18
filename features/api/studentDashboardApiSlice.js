import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentDashboardApiSlice = createApi({
  reducerPath: "studentDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/student-dashbaord",
  }),
  endpoints: (builder) => ({
    getClassCount: builder.query({
      query: (studentId) => `/${studentId}/assigned_classes_count`,
    }),
    getCourseCount: builder.query({
      query: (studentId) => `/${studentId}/assigned_courses_count`,
    }),
    getNearDeadlineAssignments: builder.query({
      query: (studentId) => `/${studentId}/near-deadline-assignments`,
    }),
  }),
});

export const {
  useGetClassCountQuery,
  useGetCourseCountQuery,
  useGetNearDeadlineAssignmentsQuery,
} = studentDashboardApiSlice;
