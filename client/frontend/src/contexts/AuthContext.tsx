import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import type {
  User,
  LoginData,
  RegisterData,
  UpdateProfileData,
  AuthContextType,
} from "../types/index";

import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
  uploadAvatar as apiUploadAvatar,
  deleteAvatar as apiDeleteAvatar,
} from "../api/modules/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasCheckedAuth = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  console.log(
    "AuthProvider is rendering. isLoading:",
    isLoading,
    "isAuthenticated:",
    !!user
  );

  useEffect(() => {
    if (hasCheckedAuth.current) {
      return;
    }
    hasCheckedAuth.current = true;

    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const response = await apiGetProfile();
        setUser(response.data.user);
      } catch (error: any) {
        console.log(error.response?.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);
  const login = useCallback(async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Login attempt...");
      const response = await apiLogin(data);
      setUser(response.data.user);
      console.log("Login successful");
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      console.log("Login failed:", errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiRegister(data);
      setUser(response.data.user);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await apiLogout();
      setUser(null);
    } catch (error: any) {
      setUser(null);
      const errorMessage = error.response?.data?.message || "Logout failed";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setError(null);
      const response = await apiUpdateProfile(data);
      setUser(response.data.user);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setError(null);
      const response = await apiUploadAvatar(file);
      setUser(response.data.user);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Avatar upload failed";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const deleteAvatar = useCallback(async () => {
    try {
      setError(null);
      const response = await apiDeleteAvatar();
      setUser(response.data.user);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Avatar deletion failed";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setError(null);
      const response = await apiGetProfile();
      setUser(response.data.user);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to refresh profile";
      setError(errorMessage);
      throw error;
    }
  }, []);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refreshProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
