import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, clearError } from '../redux/slices/authSlice';

/**
 * Convenience hook for auth state and actions.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error, sessionLoading } = useSelector(
    (s) => s.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    sessionLoading,
    error,
    login: (data) => dispatch(loginUser(data)),
    register: (data) => dispatch(registerUser(data)),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
