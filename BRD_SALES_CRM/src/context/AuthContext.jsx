import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { apiClient } from "../services/api";

// Create the context
const AuthContext = createContext();

// Custom hook to use the context
export function useAuth() {
  return useContext(AuthContext);
}

// The provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect for initial authentication check on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      apiClient
        .get("/auth/validate/")
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
          logout(); // Use the logout function to clean up
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []); // This effect runs only once on component mount

  // --- Memoize functions with useCallback to prevent infinite loops ---

  const login = useCallback(async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login/", credentials);
      const { user: loggedInUser, token } = response.data;

      localStorage.setItem("authToken", token);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }, []);

  const signIn = useCallback(async (userData) => {
    try {
      const response = await apiClient.post("/auth/signin/", userData);
      const { user: newUser, token } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
        setUser(newUser);
        setIsAuthenticated(true);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Sign-in failed",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
    localStorage.removeItem("authToken");
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get("/notifications/");
      setNotifications(response.data.results || response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const markNotificationAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
    );

    try {
      await apiClient.patch(`/notifications/${id}/read/`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: false } : notif
        )
      );
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    const readNotifications = notifications.map((notif) => ({
      ...notif,
      is_read: true,
    }));
    setNotifications(readNotifications);

    try {
      await apiClient.patch("/notifications/read-all/");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setNotifications(notifications);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  // Memoize the entire value object to prevent it from being recreated on every render
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      signIn,
      logout,
      notifications,
      unreadCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      notifications,
      unreadCount,
      login,
      signIn,
      logout,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
