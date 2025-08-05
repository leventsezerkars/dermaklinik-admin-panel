import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";

// Model Tanımları
export type UserDto = {
  id?: string;
  username?: string;
  email?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserDto = {
  username?: string;
  password?: string;
  email?: string;
  isActive: boolean;
};

export type UpdateUserDto = {
  id: string;
  username?: string;
  email?: string;
  isActive: boolean;
};

// Yup Validasyon Şemaları
export const createUserSchema = yup.object({
  username: yup.string().nullable(),
  password: yup.string().nullable(),
  email: yup.string().email("Geçerli bir email adresi giriniz").nullable(),
  isActive: yup.boolean().required(),
});

export const updateUserSchema = yup.object({
  id: yup.string().uuid().required("Kullanıcı ID zorunludur"),
  username: yup.string().nullable(),
  email: yup.string().email("Geçerli bir email adresi giriniz").nullable(),
  isActive: yup.boolean().required(),
});

export default class NewUserService {
  public static async getAll(): Promise<ApiResponse<UserDto[]>> {
    const result = await ApiService.get<UserDto[]>("/api/User");
    return result.data;
  }

  public static async getById(id: string): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.get<UserDto>(`/api/User/${id}`);
    return result.data;
  }

  public static async getByEmail(email: string): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.get<UserDto>(`/api/User/email/${email}`);
    return result.data;
  }

  public static async create(
    model: CreateUserDto
  ): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.post<UserDto>("/api/User", model);
    return result.data;
  }

  public static async update(
    model: UpdateUserDto
  ): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.put<UserDto>("/api/User", model);
    return result.data;
  }

  public static async login(model: {
    username: string;
    password: string;
  }): Promise<ApiResponse<UserDto>> {
    const result = await ApiService.post<UserDto>("/api/User/login", model);
    return result.data;
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/User/${id}`);
    return result.data;
  }
}
