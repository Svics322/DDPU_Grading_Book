import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    lastVisitedResource: "success_rate",
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    setLastVisitedResource(state, action) {
      state.lastVisitedResource = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, setLastVisitedResource } = uiSlice.actions;
export default uiSlice.reducer;
