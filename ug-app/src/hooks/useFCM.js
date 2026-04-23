import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setupFcmToken,
  requestNotificationPermission,
  onTokenRefresh,
} from '../services/fcmService';

/**
 * Hook to initialize and manage FCM token lifecycle.
 * Use this inside an authenticated screen or component.
 */
const useFCM = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubRefresh;

    const init = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) return;

      await setupFcmToken();
      unsubRefresh = onTokenRefresh();
    };

    init();

    return () => {
      unsubRefresh?.();
    };
  }, [isAuthenticated]);
};

export default useFCM;
