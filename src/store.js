import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "../features/ui/uiSlice";
import { apiSlice } from "../features/api/apiSlice";
import alertReducer from "../features/ui/alertSlice";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
    reducer: {
       ui: uiSlice,
       alert: alertReducer,
       auth: authReducer,
       [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;