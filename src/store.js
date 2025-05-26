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
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware)
    .concat(userApiSlice.middleware)
    .concat(studentApiSlice.middleware)
    .concat(classApiSlice.middleware)
    .concat(teacherApiSlice.middleware)
    .concat(academicYearApiSlice.middleware),
});

export default store;