import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminDashboardApiSlice = createApi({
  reducerPath: 'adminDashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (builder) => ({
    getStudentGradeReport: builder.query({
      query: () => `reports/student-grade`,
    }),
    getTeacherAttendanceReport: builder.query({
      query: (teacherId) => `reports/teacher-attendance/${teacherId}`,
    }),
    getClassPerformanceSummary: builder.query({
      query: () => `reports/class-performance`,
    }),
    getCourseEnrollmentSummary: builder.query({
      query: () => `reports/course-enrollment`,
    }),
    getStudentPerAcademicYear: builder.query({
        query: () => `admin-dashboard/studnet-per-academiceyear`
    }),
    getClassProgress: builder.query({
        query: (semesterId) => `admin-dashboard/semesters/${semesterId}/class-progress`
    }),
    getClassCountBySemesterId: builder.query({
        query: (semesterId) => `admin-dashboard/semesters/${semesterId}/class-student-count`
    })
  }),
});

export const {
  useGetStudentGradeReportQuery,
  useGetTeacherAttendanceReportQuery,
  useGetClassPerformanceSummaryQuery,
  useGetCourseEnrollmentSummaryQuery,
  useGetStudentPerAcademicYearQuery,
  useGetClassProgressQuery,
  useGetClassCountBySemesterIdQuery
} = adminDashboardApiSlice;
