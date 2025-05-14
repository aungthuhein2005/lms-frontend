import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeLink: '/',
    modalOpen: false,
    sidebarOpen: false
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveLink: (state, action) => {
            state.activeLink = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        closeSidebar: (state) => {
            state.sidebarOpen = false;
        },
        setOpenModal: (state) => {
            state.modalOpen = true;
        },
        setCloseModal: (state) => {
            state.modalOpen = false;
        },
    },
});

export const { setActiveLink, toggleSidebar, closeSidebar, setOpenModal,setCloseModal } = uiSlice.actions;
export default uiSlice.reducer;