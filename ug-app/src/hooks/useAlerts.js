import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAlerts,
  markRead,
  markAllRead,
  removeAlert,
} from '../redux/slices/alertSlice';

/**
 * Convenience hook for alert state and actions.
 */
const useAlerts = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, pagination, loading, error } = useSelector((s) => s.alerts);

  return {
    alerts: items,
    unreadCount,
    pagination,
    loading,
    error,
    fetchAlerts: (params) => dispatch(fetchAlerts(params)),
    markRead: (id) => dispatch(markRead(id)),
    markAllRead: () => dispatch(markAllRead()),
    deleteAlert: (id) => dispatch(removeAlert(id)),
  };
};

export default useAlerts;
