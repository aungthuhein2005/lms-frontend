import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const attendanceApiSlice = createApi({
     baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
        reducerPath: "attendanceApi",
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: () => "/attendances",
      providesTags: ["Attendance"],
    }),
        getAttendancesByType: builder.query({
      query: (type) => `/attendances/type/${type}`,
      providesTags: ["Attendance"],
    }),
    addAttendance: builder.mutation({
      query: (newData) => ({
        url: "/attendances",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["Attendance"],
    }),
    updateAttendance: builder.mutation({
      query: ({ id, data }) => ({
        url: `/attendances/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetAttendancesByTypeQuery,
} = attendanceApiSlice;