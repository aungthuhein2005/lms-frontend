import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const gradeApiSlice = createApi({
  reducerPath: 'gradeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/grades' }),
  tagTypes: ['Grade'],
  endpoints: (builder) => ({
    // Get all grades
    getAllGrades: builder.query({
      query: () => '',
      providesTags: (result = []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Grade', id })),
              { type: 'Grade', id: 'LIST' },
            ]
          : [{ type: 'Grade', id: 'LIST' }],
    }),

    // Get grade by id
    getGradeById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Grade', id }],
    }),

    // Get grades by studentId
    getGradesByStudentId: builder.query({
      query: (studentId) => `?studentId=${studentId}`, 
      providesTags: (result = [], error, studentId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Grade', id })),
              { type: 'Grade', id: `STUDENT_${studentId}` },
            ]
          : [{ type: 'Grade', id: `STUDENT_${studentId}` }],
    }),

    // Create new grade
    createGrade: builder.mutation({
      query: (grade) => ({
        url: '',
        method: 'POST',
        body: grade,
      }),
      invalidatesTags: [{ type: 'Grade', id: 'LIST' }],
    }),

    // Update existing grade
    updateGrade: builder.mutation({
      query: ({ id, ...grade }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: grade,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Grade', id }],
    }),

    // Delete grade
    deleteGrade: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Grade', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllGradesQuery,
  useGetGradeByIdQuery,
  useGetGradesByStudentIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradeApiSlice;
