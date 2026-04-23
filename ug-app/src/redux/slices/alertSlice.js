import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as alertService from '../../services/alertService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await alertService.getAlerts(params);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markRead = createAsyncThunk(
  'alerts/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await alertService.markAlertRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllRead = createAsyncThunk(
  'alerts/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await alertService.markAllAlertsRead();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeAlert = createAsyncThunk(
  'alerts/remove',
  async (id, { rejectWithValue }) => {
    try {
      await alertService.deleteAlert(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: [],
    unreadCount: 0,
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAlertError: (state) => {
      state.error = null;
    },
    // Prepend a new alert received via push notification (real-time)
    addIncomingAlert: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.alerts;
        state.unreadCount = action.payload.unreadCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(markRead.fulfilled, (state, action) => {
      const alert = state.items.find((a) => a._id === action.payload);
      if (alert && !alert.isRead) {
        alert.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    builder.addCase(markAllRead.fulfilled, (state) => {
      state.items.forEach((a) => { a.isRead = true; });
      state.unreadCount = 0;
    });

    builder.addCase(removeAlert.fulfilled, (state, action) => {
      const removed = state.items.find((a) => a._id === action.payload);
      if (removed && !removed.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((a) => a._id !== action.payload);
    });
  },
});

export const { clearAlertError, addIncomingAlert } = alertSlice.actions;
export default alertSlice.reducer;
