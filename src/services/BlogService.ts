import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { LanguageDto } from "./LanguageService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";

// Model Tanımları
export type BlogTranslationDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogId?: string | null;
  languageId: string;
  title?: string;
  content?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featuredImage?: string;
  videoUrl?: string;
  documentUrl?: string;
  language?: LanguageDto[];
};

export type BlogDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isDeleted: boolean;
  categoryId?: string;
  categoryName?: string;
  viewCount?: number;
  isActive: boolean;
  translations?: BlogTranslationDto[];
  currentTranslation?: BlogTranslationDto;
};

export type CreateBlogDto = {
  categoryId: string;
  isActive: boolean;
  translations?: CreateBlogTranslationDto[];
};

export type UpdateBlogDto = {
  id?: string;
  categoryId: string;
  isActive: boolean;
  translations?: CreateBlogTranslationDto[];
};

export type CreateBlogTranslationDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogId?: string | null;
  languageId: string;
  title?: string;
  content?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featuredImage?: string;
  videoUrl?: string;
  documentUrl?: string;
};

export type UpdateBlogTranslationDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  blogId?: string | null;
  languageId: string;
  title?: string;
  content?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featuredImage?: string;
  videoUrl?: string;
  documentUrl?: string;
};

// Yup Validasyon Şemaları
export const createBlogTranslationSchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  blogId: yup.string().uuid().nullable(),
  languageId: yup.string().uuid().required("Dil zorunludur"),
  title: yup.string().max(200).required("Başlık zorunludur"),
  content: yup.string().min(1).required("İçerik zorunludur"),
  slug: yup.string().max(200).required("Slug zorunludur"),
  seoTitle: yup.string().max(200).nullable(),
  seoDescription: yup.string().max(500).nullable(),
  seoKeywords: yup.string().max(200).nullable(),
  featuredImage: yup.string().nullable(),
  videoUrl: yup.string().nullable(),
  documentUrl: yup.string().nullable(),
});

export const createBlogSchema = yup.object({
  categoryId: yup.string().uuid().required("Kategori zorunludur"),
  isActive: yup.boolean().required(),
  translations: yup.array().of(createBlogTranslationSchema).nullable(),
});

export const updateBlogSchema = yup.object({
  id: yup.string().uuid().nullable(),
  categoryId: yup.string().uuid().required("Kategori zorunludur"),
  isActive: yup.boolean().required(),
  translations: yup.array().of(createBlogTranslationSchema).nullable(),
});

export default class BlogService {
  public static async getAll(
    params?: IPagination
  ): Promise<ApiResponse<BlogDto[]>> {
    if (!params) {
      params = defaultPagination;
    }

    // IPagination modelini API'nin beklediği parametre isimlerine dönüştür
    const apiParams = {
      Page: params.page,
      Take: params.take,
      Search: params.search,
      OrderBy: params.orderBy,
      Direction: params.direction,
      LanguageCode: params.languageCode,
      categoryId: params.categoryId,
      languageId: params.languageId,
    };

    const queryParams = toQueryString(apiParams);
    const url = `/api/Blog${queryParams ? `?${queryParams}` : ""}`;
    const result = await ApiService.get<BlogDto[]>(url);
    return result.data;
  }

  public static async getById(
    id: string,
    languageId?: string
  ): Promise<ApiResponse<BlogDto>> {
    const queryParams = new URLSearchParams();
    if (languageId) {
      queryParams.append("languageId", languageId);
    }

    const url = `/api/Blog/${id}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const result = await ApiService.get<BlogDto>(url);
    return result.data;
  }

  public static async create(
    model: CreateBlogDto
  ): Promise<ApiResponse<BlogDto>> {
    const result = await ApiService.post<BlogDto>("/api/Blog", model);
    return result.data;
  }

  public static async update(
    model: UpdateBlogDto
  ): Promise<ApiResponse<BlogDto>> {
    const result = await ApiService.put<BlogDto>("/api/Blog", model);
    return result.data;
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/Blog/${id}`);
    return result.data;
  }

  public static async incrementView(id: string): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/api/Blog/${id}/increment-view`,
      null
    );
    return result.data;
  }
}
