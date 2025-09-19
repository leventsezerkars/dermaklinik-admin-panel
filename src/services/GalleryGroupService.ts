import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";

// Model Tanımları
export type GalleryGroupDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  name?: string;
  description?: string;
  isDeletable: boolean;
  imageCount?: number;
};

export type CreateGalleryGroupDto = {
  name?: string;
  description?: string;
  isDeletable: boolean;
  isActive: boolean;
};

export type UpdateGalleryGroupDto = {
  id?: string;
  name?: string;
  description?: string;
  isDeletable: boolean;
  isActive: boolean;
};

// Yup Validasyon Şemaları
export const createGalleryGroupSchema = yup.object({
  name: yup.string().max(255).nullable(),
  description: yup.string().max(1000).nullable(),
  isDeletable: yup.boolean().required(),
  isActive: yup.boolean().required(),
});

export const updateGalleryGroupSchema = yup.object({
  id: yup.string().uuid().required(),
  name: yup.string().max(255).nullable(),
  description: yup.string().max(1000).nullable(),
  isDeletable: yup.boolean().required(),
  isActive: yup.boolean().required(),
});

class GalleryGroupService {
  private readonly baseUrl = "/api/GalleryGroup";

  // Grupları listele
  async getGroups(params?: {
    languageCode?: string;
    page?: number;
    take?: number;
    search?: string;
    orderBy?: string;
    direction?: string;
  }): Promise<GalleryGroupDto[]> {
    try {
      const queryParams = toQueryString(params);
      const response = await ApiService.get<GalleryGroupDto[]>(
        `${this.baseUrl}${queryParams}`
      );
      return (response.data as unknown as GalleryGroupDto[]) || [];
    } catch (error) {
      console.error("Galeri grupları getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Tek grup getir
  async getGroup(id: string): Promise<GalleryGroupDto> {
    try {
      const response = await ApiService.get<GalleryGroupDto>(
        `${this.baseUrl}/${id}`
      );
      return response.data as GalleryGroupDto;
    } catch (error) {
      console.error("Galeri grubu getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Grup oluştur
  async createGroup(data: CreateGalleryGroupDto): Promise<GalleryGroupDto> {
    try {
      await createGalleryGroupSchema.validate(data);
      const response = await ApiService.post<GalleryGroupDto>(
        this.baseUrl,
        data
      );
      return response.data as GalleryGroupDto;
    } catch (error) {
      console.error("Galeri grubu oluşturulurken hata oluştu:", error);
      throw error;
    }
  }

  // Grup güncelle
  async updateGroup(
    id: string,
    data: UpdateGalleryGroupDto
  ): Promise<GalleryGroupDto> {
    try {
      const updateData = { ...data, id };
      await updateGalleryGroupSchema.validate(updateData);
      const response = await ApiService.put<GalleryGroupDto>(
        `${this.baseUrl}/${id}`,
        data
      );
      return response.data as GalleryGroupDto;
    } catch (error) {
      console.error("Galeri grubu güncellenirken hata oluştu:", error);
      throw error;
    }
  }

  // Grup sil (soft delete)
  async deleteGroup(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error("Galeri grubu silinirken hata oluştu:", error);
      throw error;
    }
  }

  // Grup sil (hard delete)
  async hardDeleteGroup(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}/hard`);
    } catch (error) {
      console.error(
        "Galeri grubu kalıcı olarak silinirken hata oluştu:",
        error
      );
      throw error;
    }
  }

  // Gruptaki resimleri getir
  async getGroupImages(
    groupId: string,
    params?: {
      languageCode?: string;
      page?: number;
      take?: number;
      search?: string;
      orderBy?: string;
      direction?: string;
    }
  ): Promise<any[]> {
    try {
      const queryParams = toQueryString(params);
      const response = await ApiService.get<any[]>(
        `${this.baseUrl}/${groupId}/images${queryParams}`
      );
      return (response.data as any[]) || [];
    } catch (error) {
      console.error("Gruptaki resimler getirilirken hata oluştu:", error);
      throw error;
    }
  }
}

export default new GalleryGroupService();
