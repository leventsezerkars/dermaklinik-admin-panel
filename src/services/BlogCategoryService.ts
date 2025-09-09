import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { LanguageDto } from "./LanguageService";
import { BlogDto } from "./BlogService";

// Model Tanımları
export type BlogCategoryTranslationDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogCategoryId?: string | null;
  languageId: string;
  name?: string;
  language?: LanguageDto[];
};

export type BlogCategoryDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogs?: BlogDto[];
  translations?: BlogCategoryTranslationDto[];
};

export type CreateBlogCategoryDto = {
  isActive: boolean;
  translations?: CreateBlogCategoryTranslationDto[];
};

export type UpdateBlogCategoryDto = {
  id?: string;
  isActive: boolean;
  translations?: CreateBlogCategoryTranslationDto[];
};

export type CreateBlogCategoryTranslationDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogCategoryId?: string | null;
  languageId: string;
  name?: string;
};

export type UpdateBlogCategoryTranslationDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogCategoryId?: string | null;
  languageId: string;
  name?: string;
};

// Yup Validasyon Şemaları
export const createBlogCategoryTranslationSchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  blogCategoryId: yup.string().uuid().nullable(),
  languageId: yup.string().uuid().required("Dil zorunludur"),
  name: yup.string().max(100).required("Kategori adı zorunludur"),
});

export const createBlogCategorySchema = yup.object({
  isActive: yup.boolean().required(),
  translations: yup.array().of(createBlogCategoryTranslationSchema).nullable(),
});

export const updateBlogCategorySchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  translations: yup.array().of(createBlogCategoryTranslationSchema).nullable(),
});

export default class BlogCategoryService {
  public static async getAll(): Promise<ApiResponse<BlogCategoryDto[]>> {
    const result = await ApiService.get<BlogCategoryDto[]>("/api/BlogCategory");
    return result.data;
  }

  public static async getById(
    id: string
  ): Promise<ApiResponse<BlogCategoryDto>> {
    const result = await ApiService.get<BlogCategoryDto>(
      `/api/BlogCategory/${id}`
    );
    return result.data;
  }

  public static async create(
    model: CreateBlogCategoryDto
  ): Promise<ApiResponse<BlogCategoryDto>> {
    const result = await ApiService.post<BlogCategoryDto>(
      "/api/BlogCategory",
      model
    );
    return result.data;
  }

  public static async update(
    model: UpdateBlogCategoryDto
  ): Promise<ApiResponse<BlogCategoryDto>> {
    const result = await ApiService.put<BlogCategoryDto>(
      "/api/BlogCategory",
      model
    );
    return result.data;
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/BlogCategory/${id}`);
    return result.data;
  }
}
