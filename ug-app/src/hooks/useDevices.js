import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDevices,
  addDevice,
  removeDevice,
  sendDeviceCommand,
} from '../redux/slices/deviceSlice';

/**
 * Convenience hook for device state and actions.
 */
const useDevices = () => {
  const dispatch = useDispatch();
  const { items, loading, commandLoading, error } = useSelector((s) => s.devices);

  return {
    devices: items,
    loading,
    commandLoading,
    error,
    fetchDevices: () => dispatch(fetchDevices()),
    addDevice: (data) => dispatch(addDevice(data)),
    removeDevice: (id) => dispatch(removeDevice(id)),
    sendCommand: (id, command) => dispatch(sendDeviceCommand({ id, command })),
  };
};

export default useDevices;
