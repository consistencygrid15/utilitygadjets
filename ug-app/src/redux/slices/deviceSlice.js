import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as deviceService from '../../services/deviceService';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchDevices = createAsyncThunk(
  'devices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await deviceService.listDevices();
      return res.data.data.devices;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addDevice = createAsyncThunk(
  'devices/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await deviceService.addDevice(data);
      return res.data.data.device;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeDevice = createAsyncThunk(
  'devices/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deviceService.deleteDevice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendDeviceCommand = createAsyncThunk(
  'devices/sendCommand',
  async ({ id, command }, { rejectWithValue }) => {
    try {
      const res = await deviceService.sendCommand(id, command);
      return res.data.data.device;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    items: [],
    loading: false,
    commandLoading: false,
    error: null,
  },
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
    updateDeviceStatus: (state, action) => {
      const { id, status } = action.payload;
      const device = state.items.find((d) => d._id === id);
      if (device) device.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(addDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(removeDevice.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d._id !== action.payload);
      });

    builder
      .addCase(sendDeviceCommand.pending, (state) => {
        state.commandLoading = true;
        state.error = null;
      })
      .addCase(sendDeviceCommand.fulfilled, (state, action) => {
        state.commandLoading = false;
        const idx = state.items.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(sendDeviceCommand.rejected, (state, action) => {
        state.commandLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDeviceError, updateDeviceStatus } = deviceSlice.actions;
export default deviceSlice.reducer;
