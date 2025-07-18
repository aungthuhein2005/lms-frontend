import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../features/ui/uiSlice";
import { apiSlice } from "../features/api/apiSlice";
import alertReducer from "../features/ui/alertSlice";
import authReducer from "../features/auth/authSlice";
import { studentApiSlice } from "../features/api/studentApiSlice";
import { classApiSlice } from "../features/api/classApiSlice";
import { userApiSlice } from "../features/api/userApiSlice";
import confirmReducer from "../features/ui/confirmSlice";
import { teacherApiSlice } from "../features/api/teacherApiSlice";
import { academicYearApiSlice } from "../features/api/academicYearApiSlice";
import { semesterServiceApiSlice } from "../features/api/semesterServiceApiSlice";
import { assignmentApi } from "../features/api/assignementApiSlice";
import { courseApiSlice } from "../features/api/courseApiSlice";
import { gradeApiSlice } from "../features/api/gradeApiSlice";
import { studentDashboardApiSlice } from "../features/api/studentDashboardApiSlice";
import { attendanceApiSlice } from "../features/api/attendanceApiSlice";
import { teacherDashboardApiSlice } from "../features/api/teacherDashboardApiSlice";
import { examApiSlice } from "../features/api/examApiSlice";
import { adminDashboardApiSlice } from "../features/api/adminDashboardApiSlice";

const store = configureStore({
    reducer: {
       ui: uiSlice,
       alert: alertReducer,
       auth: authReducer,
       confirm: confirmReducer,
       [apiSlice.reducerPath]: apiSlice.reducer,
       [studentApiSlice.reducerPath]: studentApiSlice.reducer,
       [classApiSlice.reducerPath]: classApiSlice.reducer,
       [userApiSlice.reducerPath]: userApiSlice.reducer,
       [teacherApiSlice.reducerPath]: teacherApiSlice.reducer,
       [academicYearApiSlice.reducerPath]: academicYearApiSlice.reducer,
       [semesterServiceApiSlice.reducerPath]: semesterServiceApiSlice.reducer,
       [assignmentApi.reducerPath]: assignmentApi.reducer,
       [courseApiSlice.reducerPath]: courseApiSlice.reducer,
       [gradeApiSlice.reducerPath]: gradeApiSlice.reducer,
       [studentDashboardApiSlice.reducerPath]: studentDashboardApiSlice.reducer,
       [attendanceApiSlice.reducerPath]: attendanceApiSlice.reducer,
       [teacherDashboardApiSlice.reducerPath]: teacherDashboardApiSlice.reducer,
       [examApiSlice.reducerPath]: examApiSlice.reducer,
       [adminDashboardApiSlice.reducerPath]: adminDashboardApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware)
    .concat(userApiSlice.middleware)
    .concat(studentApiSlice.middleware)
    .concat(classApiSlice.middleware)
    .concat(teacherApiSlice.middleware)
    .concat(academicYearApiSlice.middleware)
    .concat(semesterServiceApiSlice.middleware)
    .concat(assignmentApi.middleware)
    .concat(courseApiSlice.middleware)
    .concat(gradeApiSlice.middleware)
    .concat(studentDashboardApiSlice.middleware)
    .concat(attendanceApiSlice.middleware)
    .concat(teacherDashboardApiSlice.middleware)
    .concat(examApiSlice.middleware)
    .concat(adminDashboardApiSlice.middleware),
});

export default store;