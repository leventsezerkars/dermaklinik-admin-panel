import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";

// Model Tanımları
export type LoginDto = {
  username: string;
  password: string;
};

export type CreateUserDto = {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
};

export type LoginResponseDto = {
  token: string;
  user: UserDto;
};

export type UserDto = {
  id: string;
  username?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

// Yup Validasyon Şemaları
export const loginSchema = yup.object({
  username: yup.string().required("Kullanıcı adı zorunludur"),
  password: yup.string().required("Şifre zorunludur"),
});

export const registerSchema = yup.object({
  username: yup.string().required("Kullanıcı adı zorunludur"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .required("Şifre zorunludur"),
  email: yup
    .string()
    .email("Geçerli bir email adresi giriniz")
    .required("Email zorunludur"),
  firstName: yup.string().required("Ad zorunludur"),
  lastName: yup.string().required("Soyad zorunludur"),
  isActive: yup.boolean().required("Aktiflik durumu zorunludur"),
});

export default class AuthService {
  public static async login(
    model: LoginDto
  ): Promise<ApiResponse<LoginResponseDto>> {
    const result = await ApiService.post<LoginResponseDto>(
      "/api/Auth/login",
      model
    );
    return result.data;
  }

  public static async register(
    model: CreateUserDto
  ): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.post<UserDto>("/api/Auth/register", model);
    return result.data;
  }

  public static async logout(): Promise<ApiResponse<boolean>> {
    const result = await ApiService.post<boolean>("/api/Auth/logout", {});
    return result.data;
  }
}
