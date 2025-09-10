import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { LanguageDto } from "./LanguageService";

// Model Tanımları
export type MenuType = 0 | 1 | 2 | 3; // Page = 0, Link = 1, Content = 2, Anchor = 3

export type MenuTranslationDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  menuId?: string | null;
  languageId: string;
  title?: string;
  content?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  language?: LanguageDto;
};

export type CreateMenuTranslationDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  menuId: string;
  languageId: string;
  title?: string;
  content?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};

export type MenuDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  parentId?: string;
  sortOrder: number;
  slug?: string;
  isDeletable: boolean;
  type: MenuType;
  target?: string;
  children?: MenuDto[];
  translations?: MenuTranslationDto[];
};

export type CreateMenuDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  parentId?: string;
  sortOrder: number;
  slug?: string;
  isDeletable: boolean;
  type: MenuType;
  target?: string;
  translations?: CreateMenuTranslationDto[];
};

export type UpdateMenuDto = {
  id?: string;
  isActive: boolean;
  isDeleted: boolean;
  parentId?: string;
  sortOrder: number;
  slug?: string;
  isDeletable: boolean;
  type: MenuType;
  target?: string;
  translations?: CreateMenuTranslationDto[];
};

// Yup Validasyon Şemaları
export const createMenuTranslationSchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  menuId: yup.string().uuid().required("Menu ID zorunludur"),
  languageId: yup.string().uuid().required("Dil ID zorunludur"),
  title: yup.string().nullable(),
  content: yup.string().nullable(),
  slug: yup.string().nullable(),
  seoTitle: yup.string().nullable(),
  seoDescription: yup.string().nullable(),
  seoKeywords: yup.string().nullable(),
});

export const createMenuSchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  parentId: yup.string().uuid().nullable(),
  sortOrder: yup.number().required("Sıralama zorunludur"),
  slug: yup.string().nullable(),
  isDeletable: yup.boolean().required(),
  type: yup.number().oneOf([0, 1, 2, 3]).required("Tip zorunludur"),
  target: yup.string().nullable(),
  translations: yup.array().of(createMenuTranslationSchema).nullable(),
});

export const updateMenuSchema = yup.object({
  id: yup.string().uuid().nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
  parentId: yup.string().uuid().nullable(),
  sortOrder: yup.number().required("Sıralama zorunludur"),
  slug: yup.string().nullable(),
  isDeletable: yup.boolean().required(),
  type: yup.number().oneOf([0, 1, 2, 3]).required("Tip zorunludur"),
  target: yup.string().nullable(),
  translations: yup.array().of(createMenuTranslationSchema).nullable(),
});

export default class MenuService {
  public static async getAll(): Promise<ApiResponse<MenuDto[]>> {
    const result = await ApiService.get<MenuDto[]>("/api/Menu?take=10000");
    return result.data;
  }

  public static async getById(id: string): Promise<ApiResponse<MenuDto>> {
    const result = await ApiService.get<MenuDto>(`/api/Menu/${id}`);
    return result.data;
  }

  public static async create(
    model: CreateMenuDto
  ): Promise<ApiResponse<MenuDto>> {
    const result = await ApiService.post<MenuDto>("/api/Menu", model);
    return result.data;
  }

  public static async update(
    model: UpdateMenuDto
  ): Promise<ApiResponse<MenuDto>> {
    const result = await ApiService.put<MenuDto>("/api/Menu", model);
    return result.data;
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/Menu/${id}`);
    return result.data;
  }
}
