import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";

// Model Tanımları
export type GalleryImageGroupMapDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  imageId: string;
  groupId: string;
  sortOrder: number;
  image?: any;
  group?: any;
};

export type CreateGalleryImageGroupMapDto = {
  imageId: string;
  groupId: string;
  sortOrder: number;
};

export type UpdateGalleryImageGroupMapDto = {
  id?: string;
  imageId: string;
  groupId: string;
  sortOrder: number;
};

export type UpdateSortOrderDto = {
  imageId: string;
  groupId: string;
  newSortOrder: number;
};

// Yup Validasyon Şemaları
export const createGalleryImageGroupMapSchema = yup.object({
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
  sortOrder: yup.number().integer().min(0).required("Sıralama zorunludur"),
});

export const updateGalleryImageGroupMapSchema = yup.object({
  id: yup.string().uuid().required(),
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
  sortOrder: yup.number().integer().min(0).required("Sıralama zorunludur"),
});

export const updateSortOrderSchema = yup.object({
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
  newSortOrder: yup
    .number()
    .integer()
    .min(0)
    .required("Yeni sıralama zorunludur"),
});

class GalleryImageGroupMapService {
  private readonly baseUrl = "/api/GalleryImageGroupMap";

  // Mapping'leri listele
  async getMappings(params?: {
    languageCode?: string;
    page?: number;
    take?: number;
    search?: string;
    orderBy?: string;
    direction?: string;
  }): Promise<GalleryImageGroupMapDto[]> {
    try {
      const queryParams = toQueryString(params);
      const response = await ApiService.get<GalleryImageGroupMapDto[]>(
        `${this.baseUrl}${queryParams}`
      );
      return (response.data.list as unknown as GalleryImageGroupMapDto[]) || [];
    } catch (error) {
      console.error("Resim-grup mapping'leri getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Tek mapping getir
  async getMapping(id: string): Promise<GalleryImageGroupMapDto> {
    try {
      const response = await ApiService.get<GalleryImageGroupMapDto>(
        `${this.baseUrl}/${id}`
      );
      return (
        (response.data.entity as GalleryImageGroupMapDto) ||
        (response.data as GalleryImageGroupMapDto)
      );
    } catch (error) {
      console.error("Resim-grup mapping'i getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Mapping oluştur
  async createMapping(
    data: CreateGalleryImageGroupMapDto
  ): Promise<GalleryImageGroupMapDto> {
    try {
      await createGalleryImageGroupMapSchema.validate(data);
      const response = await ApiService.post<GalleryImageGroupMapDto>(
        this.baseUrl,
        data
      );
      return (
        (response.data.entity as GalleryImageGroupMapDto) ||
        (response.data as GalleryImageGroupMapDto)
      );
    } catch (error) {
      console.error("Resim-grup mapping'i oluşturulurken hata oluştu:", error);
      throw error;
    }
  }

  // Mapping güncelle
  async updateMapping(
    id: string,
    data: UpdateGalleryImageGroupMapDto
  ): Promise<GalleryImageGroupMapDto> {
    try {
      const updateData = { ...data, id };
      await updateGalleryImageGroupMapSchema.validate(updateData);
      const response = await ApiService.put<GalleryImageGroupMapDto>(
        `${this.baseUrl}/${id}`,
        data
      );
      return (
        (response.data.entity as GalleryImageGroupMapDto) ||
        (response.data as GalleryImageGroupMapDto)
      );
    } catch (error) {
      console.error("Resim-grup mapping'i güncellenirken hata oluştu:", error);
      throw error;
    }
  }

  // Mapping sil (soft delete)
  async deleteMapping(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error("Resim-grup mapping'i silinirken hata oluştu:", error);
      throw error;
    }
  }

  // Mapping sil (hard delete)
  async hardDeleteMapping(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}/hard`);
    } catch (error) {
      console.error(
        "Resim-grup mapping'i kalıcı olarak silinirken hata oluştu:",
        error
      );
      throw error;
    }
  }

  // Resme göre mapping'leri getir
  async getMappingsByImage(
    imageId: string
  ): Promise<GalleryImageGroupMapDto[]> {
    try {
      const response = await ApiService.get<GalleryImageGroupMapDto[]>(
        `${this.baseUrl}/by-image/${imageId}`
      );
      return (response.data.list as unknown as GalleryImageGroupMapDto[]) || [];
    } catch (error) {
      console.error("Resme göre mapping'ler getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Gruba göre mapping'leri getir
  async getMappingsByGroup(
    groupId: string
  ): Promise<GalleryImageGroupMapDto[]> {
    try {
      const response = await ApiService.get<GalleryImageGroupMapDto[]>(
        `${this.baseUrl}/by-group/${groupId}`
      );
      return (response.data.list as unknown as GalleryImageGroupMapDto[]) || [];
    } catch (error) {
      console.error("Gruba göre mapping'ler getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Sıralama güncelle
  async updateSortOrder(data: UpdateSortOrderDto): Promise<void> {
    try {
      await updateSortOrderSchema.validate(data);
      await ApiService.put(`${this.baseUrl}/update-sort-order`, data);
    } catch (error) {
      console.error("Sıralama güncellenirken hata oluştu:", error);
      throw error;
    }
  }
}

export default new GalleryImageGroupMapService();
