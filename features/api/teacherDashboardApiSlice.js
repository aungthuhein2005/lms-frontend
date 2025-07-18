import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teacherDashboardApiSlice = createApi({
  reducerPath: 'teacherDashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/teacher-dashboard' }), 
  endpoints: (builder) => ({
    getAssignedClassesCount: builder.query({
      query: (teacherId) => `/${teacherId}/assigned_classes_count`,
    }),
    getAssignedCoursesCount: builder.query({
      query: (teacherId) => `/${teacherId}/assigned_courses_count`,
    }),
    getNearDeadlineAssignments: builder.query({
      query: (teacherId) => `/${teacherId}/near-deadline-assignments`,
    }),
    getCourseProgress: builder.query({
      query: (teacherId) => `/${teacherId}/course-progress`,
    }),
    getRecentExams: builder.query({
      query: (teacherId) => `/${teacherId}/recent-exams`,
    }),
    getClassSummary: builder.query({
        query: (classId) => `http://localhost:8080/classes/${classId}/summary`
    }),
    
  }),
});

export const {
  useGetAssignedClassesCountQuery,
  useGetAssignedCoursesCountQuery,
  useGetNearDeadlineAssignmentsQuery,
  useGetCourseProgressQuery,
  useGetClassSummaryQuery,
  useGetRecentExamsQuery,
} = teacherDashboardApiSlice;
