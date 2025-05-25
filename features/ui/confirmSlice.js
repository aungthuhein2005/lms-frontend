import { createSlice } from "@reduxjs/toolkit";

const confirmSlice = createSlice({
    name: 'confirm',
    initialState: {
        show: false,
        message: '',
        title: '',
        onConfirm: null,
        onCancel: null,
    },
    reducers: {
        showConfirm: (state, action) => {
            state.show = true;
            state.message = action.payload.message;
            state.title = action.payload.title;
            state.onConfirm = action.payload.onConfirm;
            state.onCancel = action.payload.onCancel;
        },
        hideConfirm: (state) => {
            state.show = false;
            state.message = '';
            state.title = '';
            state.onConfirm = null;
            state.onCancel = null;
        }
    }
});

export const { showConfirm, hideConfirm } = confirmSlice.actions;
export default confirmSlice.reducer;
