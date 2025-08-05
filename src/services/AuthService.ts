import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";

// Model Tanımları
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserDto = {
  id?: string;
  username?: string;
  email?: string;
  isActive: boolean;
  isDeleted: boolean;
  firstName?: string;
  lastName?: string;
};

// Yup Validasyon Şemaları
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Geçerli bir email adresi giriniz")
    .required("Email zorunludur"),
  password: yup.string().required("Şifre zorunludur"),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Geçerli bir email adresi giriniz")
    .required("Email zorunludur"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  firstName: yup.string().required("Ad zorunludur"),
  lastName: yup.string().required("Soyad zorunludur"),
});

export default class AuthService {
  public static async login(model: LoginRequest): Promise<ApiResponse<string>> {
    const result = await ApiService.post<string>("/api/Auth/login", model);
    return result.data;
  }

  public static async register(
    model: RegisterRequest
  ): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.post<UserDto>("/api/Auth/register", model);
    return result.data;
  }

  public static async logout(): Promise<ApiResponse<boolean>> {
    const result = await ApiService.post<boolean>("/api/Auth/logout", {});
    return result.data;
  }
}
