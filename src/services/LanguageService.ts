import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";

// Model Tanımları
export type LanguageDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  code: string;
  isDefault: boolean;
};

export type CreateLanguageDto = {
  name: string;
  code: string;
  isActive: boolean;
  isDefault: boolean;
};

export type UpdateLanguageDto = {
  id?: string;
  name: string;
  code: string;
  isActive: boolean;
  isDeleted: boolean;
  isDefault: boolean;
};

// Yup Validasyon Şemaları
export const createLanguageSchema = yup.object({
  name: yup.string().max(50).required("Dil adı zorunludur"),
  code: yup.string().max(10).required("Kod zorunludur"),
  isActive: yup.boolean().required(),
  isDefault: yup.boolean().required(),
});

export const updateLanguageSchema = yup.object({
  id: yup.string().uuid().nullable(),
  name: yup.string().max(50).required("Dil adı zorunludur"),
  code: yup.string().max(10).required("Kod zorunludur"),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  isDefault: yup.boolean().required(),
});

export default class LanguageService {
  public static async getAll(): Promise<ApiResponse<LanguageDto[]>> {
    const result = await ApiService.get<LanguageDto[]>("/api/Language");
    return result.data;
  }

  public static async create(
    model: CreateLanguageDto
  ): Promise<ApiResponse<LanguageDto>> {
    const result = await ApiService.post<LanguageDto>("/api/Language", model);
    return result.data;
  }

  public static async update(
    model: UpdateLanguageDto
  ): Promise<ApiResponse<LanguageDto>> {
    const result = await ApiService.put<LanguageDto>("/api/Language", model);
    return result.data;
  }
}
