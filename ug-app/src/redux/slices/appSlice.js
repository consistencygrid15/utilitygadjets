import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    globalLoading: false,
    toastMessage: null, // { type: 'success'|'error'|'info', text: string }
    notificationsEnabled: true,
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastMessage = action.payload;
    },
    hideToast: (state) => {
      state.toastMessage = null;
    },
    setNotificationsEnabled: (state, action) => {
      state.notificationsEnabled = action.payload;
    },
  },
});

export const { setGlobalLoading, showToast, hideToast, setNotificationsEnabled } =
  appSlice.actions;
export default appSlice.reducer;
