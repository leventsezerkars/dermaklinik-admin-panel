import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";

// Model Tanımları
export type CompanyInfoDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  creator?: any;
  updater?: any;
  isActive: boolean;
  isDeleted: boolean;
  logoUrl?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  googleMapsUrl?: string;
  googleAnalyticsCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  workingHours?: string;
};

export type CreateCompanyInfoDto = {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  googleMapsUrl?: string;
  googleAnalyticsCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  workingHours?: string;
  isActive: boolean;
};

export type UpdateCompanyInfoDto = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedIn?: string;
  googleMapsUrl?: string;
  googleAnalyticsCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  workingHours?: string;
  isActive: boolean;
  isDeleted: boolean;
};

// Yup Validasyon Şemaları
export const createCompanyInfoSchema = yup.object({
  name: yup.string().max(255).required("Şirket adı zorunludur"),
  address: yup.string().max(500).required("Adres zorunludur"),
  phone: yup.string().max(100).required("Telefon zorunludur"),
  email: yup
    .string()
    .email("Geçerli bir email adresi giriniz")
    .max(255)
    .required("Email zorunludur"),
  logoUrl: yup.string().max(500).nullable(),
  facebook: yup.string().max(255).nullable(),
  twitter: yup.string().max(255).nullable(),
  instagram: yup.string().max(255).nullable(),
  linkedIn: yup.string().max(255).nullable(),
  googleMapsUrl: yup.string().max(1000).nullable(),
  googleAnalyticsCode: yup.string().max(1000).nullable(),
  metaTitle: yup.string().max(255).nullable(),
  metaDescription: yup.string().max(1000).nullable(),
  metaKeywords: yup.string().max(255).nullable(),
  workingHours: yup.string().max(255).nullable(),
  isActive: yup.boolean().required(),
});

export const updateCompanyInfoSchema = yup.object({
  id: yup.string().uuid().required("ID zorunludur"),
  name: yup.string().max(255).required("Şirket adı zorunludur"),
  address: yup.string().max(500).required("Adres zorunludur"),
  phone: yup.string().max(100).required("Telefon zorunludur"),
  email: yup
    .string()
    .email("Geçerli bir email adresi giriniz")
    .max(255)
    .required("Email zorunludur"),
  logoUrl: yup.string().max(500).nullable(),
  facebook: yup.string().max(255).nullable(),
  twitter: yup.string().max(255).nullable(),
  instagram: yup.string().max(255).nullable(),
  linkedIn: yup.string().max(255).nullable(),
  googleMapsUrl: yup.string().max(1000).nullable(),
  googleAnalyticsCode: yup.string().max(1000).nullable(),
  metaTitle: yup.string().max(255).nullable(),
  metaDescription: yup.string().max(1000).nullable(),
  metaKeywords: yup.string().max(255).nullable(),
  workingHours: yup.string().max(255).nullable(),
  isActive: yup.boolean().required(),
  isDeleted: yup.boolean().required(),
});

export default class CompanyInfoService {
  public static async getAll(): Promise<ApiResponse<CompanyInfoDto[]>> {
    const result = await ApiService.get<CompanyInfoDto[]>("/api/CompanyInfo");
    return result.data;
  }

  public static async getPaged(params: {
    LanguageCode?: string;
    Page?: number;
    Take?: number;
    Search?: string;
    OrderBy?: string;
    Direction?: string;
    Name?: string;
    Email?: string;
    Phone?: string;
    IsActive?: boolean;
    CreatedDateFrom?: string;
    CreatedDateTo?: string;
  }): Promise<ApiResponse<CompanyInfoDto[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const result = await ApiService.get<CompanyInfoDto[]>(
      `/api/CompanyInfo/paged?${queryParams.toString()}`
    );
    return result.data;
  }

  public static async getActive(): Promise<ApiResponse<CompanyInfoDto[]>> {
    const result = await ApiService.get<CompanyInfoDto[]>(
      "/api/CompanyInfo/active"
    );
    return result.data;
  }

  public static async getActiveSingle(): Promise<ApiResponse<CompanyInfoDto>> {
    const result = await ApiService.get<CompanyInfoDto>(
      "/api/CompanyInfo/active/single"
    );
    return result.data;
  }

  public static async getById(
    id: string
  ): Promise<ApiResponse<CompanyInfoDto>> {
    const result = await ApiService.get<CompanyInfoDto>(
      `/api/CompanyInfo/${id}`
    );
    return result.data;
  }

  public static async create(
    model: CreateCompanyInfoDto
  ): Promise<ApiResponse<CompanyInfoDto>> {
    const result = await ApiService.post<CompanyInfoDto>(
      "/api/CompanyInfo",
      model
    );
    return result.data;
  }

  public static async update(
    model: UpdateCompanyInfoDto
  ): Promise<ApiResponse<CompanyInfoDto>> {
    const result = await ApiService.put<CompanyInfoDto>(
      "/api/CompanyInfo",
      model
    );
    return result.data;
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/CompanyInfo/${id}`);
    return result.data;
  }

  public static async hardDelete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/api/CompanyInfo/${id}/hard`);
    return result.data;
  }

  public static async checkNameUnique(
    name: string,
    excludeId?: string
  ): Promise<ApiResponse<boolean>> {
    const params = new URLSearchParams({ name });
    if (excludeId) {
      params.append("excludeId", excludeId);
    }
    const result = await ApiService.get<boolean>(
      `/api/CompanyInfo/check-name-unique?${params.toString()}`
    );
    return result.data;
  }

  public static async checkEmailUnique(
    email: string,
    excludeId?: string
  ): Promise<ApiResponse<boolean>> {
    const params = new URLSearchParams({ email });
    if (excludeId) {
      params.append("excludeId", excludeId);
    }
    const result = await ApiService.get<boolean>(
      `/api/CompanyInfo/check-email-unique?${params.toString()}`
    );
    return result.data;
  }

  public static async exists(id: string): Promise<ApiResponse<boolean>> {
    const result = await ApiService.get<boolean>(
      `/api/CompanyInfo/${id}/exists`
    );
    return result.data;
  }
}
