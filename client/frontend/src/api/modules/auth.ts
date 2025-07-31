import { apiClient } from "../axiosClient";
import type {
  User,
  LoginData,
  RegisterData,
  UpdateProfileData,
  ApiResponse,
} from "../../types";

export interface UserResponse {
  user: User;
}

/**
 * Registers a new user.
 * @param data - The user's registration details.
 * @returns The newly created user's data.
 */
export const register = async (
  data: RegisterData
): Promise<ApiResponse<UserResponse>> => {
  return apiClient.post<ApiResponse<UserResponse>, RegisterData>(
    "/auth/register",
    data
  );
};

/**
 * Logs a user in using local strategy.
 * @param data - The user's credentials (email and password).
 * @returns The user's data.
 */
export const login = async (
  data: LoginData
): Promise<ApiResponse<UserResponse>> => {
  return apiClient.post<ApiResponse<UserResponse>>("/auth/login", data);
};

/**
 * Logs the current user out by destroying the session on the server.
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  return apiClient.post<ApiResponse<null>>("/auth/logout");
};

/**
 * Fetches the currently authenticated user's profile from the server session.
 * @returns The current user's data.
 */
export const getProfile = async (): Promise<ApiResponse<UserResponse>> => {
  return apiClient.get<ApiResponse<UserResponse>>("/auth/profile");
};

/**
 * Updates the currently authenticated user's profile.
 * @param data - The profile data to update.
 * @returns The updated user data.
 */
export const updateProfile = async (
  data: UpdateProfileData
): Promise<ApiResponse<UserResponse>> => {
  return apiClient.put<ApiResponse<UserResponse>, UpdateProfileData>(
    "/auth/profile",
    data
  );
};

/**
 * Uploads a new avatar for the currently authenticated user.
 * @param file - The image file to upload.
 * @returns The user data with the updated avatar URL.
 */
export const uploadAvatar = async (
  file: File
): Promise<ApiResponse<UserResponse>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiClient.upload<ApiResponse<UserResponse>>("/auth/avatar", formData);
};

/**
 * Deletes the current user's avatar.
 * @returns The user data with the avatar set to null or a default.
 */
export const deleteAvatar = async (): Promise<ApiResponse<UserResponse>> => {
  return apiClient.delete<ApiResponse<UserResponse>>("/auth/avatar");
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Initiates Google OAuth flow by redirecting the user to the Google authentication URL.
 */
export const getGoogleAuthUrl = (): string => {
  return `${API_BASE_URL}/auth/google`;
};
