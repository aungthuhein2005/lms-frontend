import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        show: false,
        message: '',
        title: '',
        type: 'success', // 'success', 'error', 'info', 'warning'
    },
    reducers: {
        showAlert : (state,action) =>{
            state.show = true;
            state.message = action.payload.message;
            state.title = action.payload.title;
            state.type = action.payload.type;
        },
        hideAlert : (state) =>{
            state.show = false;
            state.message = '';
            state.title = '';
            state.type = 'success';
        }
    }
})

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;