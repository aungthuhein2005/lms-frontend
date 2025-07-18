import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const examApiSlice = createApi({
  reducerPath: 'examApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/exams' }),
  tagTypes: ['Exams'], // declare tag types here
  endpoints: (builder) => ({
    getAllExams: builder.query({
      query: () => `/all`,
      providesTags: ['Exams'], // mark this query as providing 'Exams' tag
    }),
    getAllExamsByTeacher: builder.query({
      query: (teacherId) => `/${teacherId}`,
      providesTags: (result, error, teacherId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Exams', id })),
              { type: 'Exams', id: 'LIST' },
            ]
          : [{ type: 'Exams', id: 'LIST' }],
    }),
    getExamById: builder.query({
      query: (examId) => `/${examId}`,
      providesTags: (result, error, examId) => [{ type: 'Exams', id: examId }],
    }),
    getClassExams: builder.query({
      query: (classId) => `/class/${classId}`,
      providesTags: (result, error, classId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Exams', id })),
              { type: 'Exams', id: `CLASS-${classId}` },
            ]
          : [{ type: 'Exams', id: `CLASS-${classId}` }],
    }),
    getExamSubmissions: builder.query({
      query: (examId) => `/${examId}/submissions`,
      // submissions might have own tags if you want to track separately
    }),
    getExamGradeByStudentId: builder.query({
      query: (studentId) => `/students/${studentId}` 
    }),
    createExam: builder.mutation({
      query: (newExam) => ({
        url: `/create`,
        method: 'POST',
        body: newExam,
      }),
      invalidatesTags: ['Exams'], // invalidate all Exams queries after create
    }),
    updateExam: builder.mutation({
      query: ({ examId, ...data }) => ({
        url: `/${examId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { examId }) => [{ type: 'Exams', id: examId }],
    }),
    deleteExam: builder.mutation({
      query: (examId) => ({
        url: `/${examId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, examId) => [
        { type: 'Exams', id: examId },
        { type: 'Exams', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllExamsQuery,
  useGetAllExamsByTeacherQuery,
  useGetExamByIdQuery,
  useGetClassExamsQuery,
  useGetExamSubmissionsQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamGradeByStudentIdQuery,
} = examApiSlice;
