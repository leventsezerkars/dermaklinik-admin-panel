import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";

// Model Tanımları
export type GalleryImageDto = {
  id?: string;
  createdAt?: string;
  createdById?: string;
  updatedAt?: string;
  updatedById?: string;
  isActive: boolean;
  isDeleted: boolean;
  imageUrl?: string;
  title?: string;
  altText?: string;
  caption?: string;
  sortOrder?: number;
  groupIds?: string[];
  groups?: Array<{
    id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
  }>;
};

export type CreateGalleryImageDto = {
  ImageFile?: File | string; // File for upload, string for base64
  Title?: string;
  AltText?: string;
  Caption?: string;
  IsActive: boolean;
  GroupIds?: string[];
};

export type UpdateGalleryImageDto = {
  id?: string;
  ImageFile?: File | string; // File for upload, string for base64
  Title?: string;
  AltText?: string;
  Caption?: string;
  IsActive: boolean;
  GroupIds?: string[];
};

export type AddToGroupCommand = {
  imageId: string;
  groupId: string;
  sortOrder: number;
};

export type RemoveFromGroupCommand = {
  imageId: string;
  groupId: string;
};

export type UpdateImageOrderCommand = {
  imageId: string;
  groupId: string;
  newSortOrder: number;
};

// Yup Validasyon Şemaları
export const createGalleryImageSchema = yup.object({
  ImageFile: yup.mixed().nullable(),
  Title: yup.string().nullable(),
  AltText: yup.string().nullable(),
  Caption: yup.string().nullable(),
  IsActive: yup.boolean().required(),
  GroupIds: yup.array().of(yup.string().required()).nullable().default([]),
});

export const updateGalleryImageSchema = yup.object({
  id: yup.string().uuid().required(),
  ImageFile: yup.mixed().nullable(),
  Title: yup.string().nullable(),
  AltText: yup.string().nullable(),
  Caption: yup.string().nullable(),
  IsActive: yup.boolean().required(),
  GroupIds: yup.array().of(yup.string().required()).nullable().default([]),
});

export const addToGroupSchema = yup.object({
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
  sortOrder: yup.number().integer().min(0).required("Sıralama zorunludur"),
});

export const removeFromGroupSchema = yup.object({
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
});

export const updateImageOrderSchema = yup.object({
  imageId: yup.string().uuid().required("Resim ID zorunludur"),
  groupId: yup.string().uuid().required("Grup ID zorunludur"),
  newSortOrder: yup
    .number()
    .integer()
    .min(0)
    .required("Yeni sıralama zorunludur"),
});

class GalleryImageService {
  private readonly baseUrl = "/api/GalleryImage";

  // Resimleri listele
  async getImages(params?: {
    languageCode?: string;
    page?: number;
    take?: number;
    search?: string;
    orderBy?: string;
    direction?: string;
    groupId?: string;
  }): Promise<GalleryImageDto[]> {
    try {
      const queryParams = toQueryString(params);
      const response = await ApiService.get<GalleryImageDto[]>(
        `${this.baseUrl}?${queryParams}`
      );
      return (response.data as unknown as GalleryImageDto[]) || [];
    } catch (error) {
      console.error("Resimler getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Tek resim getir
  async getImage(id: string): Promise<GalleryImageDto> {
    try {
      const response = await ApiService.get<GalleryImageDto>(
        `${this.baseUrl}/${id}`
      );
      return (
        (response.data.entity as GalleryImageDto) ||
        (response.data as GalleryImageDto)
      );
    } catch (error) {
      console.error("Resim getirilirken hata oluştu:", error);
      throw error;
    }
  }

  // Resim oluştur
  async createImage(data: CreateGalleryImageDto): Promise<GalleryImageDto> {
    try {
      await createGalleryImageSchema.validate(data);

      // FormData oluştur
      const formData = new FormData();

      if (data.ImageFile) {
        if (data.ImageFile instanceof File) {
          formData.append("ImageFile", data.ImageFile);
        } else {
          // Base64 string ise blob'a çevir
          const byteCharacters = atob(data.ImageFile.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          formData.append("ImageFile", blob, "image.jpg");
        }
      }

      if (data.Title) formData.append("Title", data.Title);
      if (data.AltText) formData.append("AltText", data.AltText);
      if (data.Caption) formData.append("Caption", data.Caption);
      formData.append("IsActive", data.IsActive.toString());

      console.log("GroupIds değeri:", data.GroupIds);
      if (data.GroupIds && data.GroupIds.length > 0) {
        console.log("GroupIds FormData'ya ekleniyor:", data.GroupIds);
        // GroupIds'i indexlenmiş form parametreleri olarak gönder
        data.GroupIds.forEach((groupId, index) => {
          formData.append(`GroupIds[${index}]`, groupId);
        });
      } else {
        console.log("GroupIds boş veya tanımsız");
      }

      // FormData içeriğini kontrol et
      console.log("FormData içeriği:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await ApiService.post<GalleryImageDto>(
        this.baseUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return (
        (response.data.entity as GalleryImageDto) ||
        (response.data as GalleryImageDto)
      );
    } catch (error) {
      console.error("Resim oluşturulurken hata oluştu:", error);
      throw error;
    }
  }

  // Resim güncelle
  async updateImage(
    id: string,
    data: UpdateGalleryImageDto
  ): Promise<GalleryImageDto> {
    try {
      // data'dan id'yi çıkar ve parametre olarak gelen id'yi kullan
      const { id: dataId, ...dataWithoutId } = data;
      //const updateData = { ...dataWithoutId, id: id };
      // UUID formatını test et
      // Yup validation'ı geçici olarak bypass ediyoruz
      //await updateGalleryImageSchema.validate(updateData);
      // FormData oluştur
      const formData = new FormData();

      if (data.ImageFile) {
        if (data.ImageFile instanceof File) {
          formData.append("ImageFile", data.ImageFile);
        } else {
          // Base64 string ise blob'a çevir
          const byteCharacters = atob(data.ImageFile.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          formData.append("ImageFile", blob, "image.jpg");
        }
      }

      if (data.Title) formData.append("Title", data.Title);
      if (data.AltText) formData.append("AltText", data.AltText);
      if (data.Caption) formData.append("Caption", data.Caption);
      formData.append("IsActive", data.IsActive.toString());

      if (data.GroupIds && data.GroupIds.length > 0) {
        // GroupIds'i indexlenmiş form parametreleri olarak gönder
        data.GroupIds.forEach((groupId, index) => {
          formData.append(`GroupIds[${index}]`, groupId);
        });
      }

      const response = await ApiService.put<GalleryImageDto>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return (
        (response.data.entity as GalleryImageDto) ||
        (response.data as GalleryImageDto)
      );
    } catch (error) {
      console.error("Resim güncellenirken hata oluştu:", error);
      if (error instanceof Error) {
        console.error("Hata detayı:", error.message);
        console.error("Hata stack:", error.stack);
      }
      throw error;
    }
  }

  // Resim sil (soft delete)
  async deleteImage(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error("Resim silinirken hata oluştu:", error);
      throw error;
    }
  }

  // Resim sil (hard delete)
  async hardDeleteImage(id: string): Promise<void> {
    try {
      await ApiService.delete(`${this.baseUrl}/${id}/hard`);
    } catch (error) {
      console.error("Resim kalıcı olarak silinirken hata oluştu:", error);
      throw error;
    }
  }

  // Resmi gruba ekle
  async addToGroup(data: AddToGroupCommand): Promise<void> {
    try {
      await addToGroupSchema.validate(data);
      await ApiService.post(`${this.baseUrl}/add-to-group`, data);
    } catch (error) {
      console.error("Resim gruba eklenirken hata oluştu:", error);
      throw error;
    }
  }

  // Resmi gruptan çıkar
  async removeFromGroup(data: RemoveFromGroupCommand): Promise<void> {
    try {
      await removeFromGroupSchema.validate(data);
      await ApiService.post(`${this.baseUrl}/remove-from-group`, data);
    } catch (error) {
      console.error("Resim gruptan çıkarılırken hata oluştu:", error);
      throw error;
    }
  }

  // Resim sıralamasını güncelle
  async updateImageOrder(data: UpdateImageOrderCommand): Promise<void> {
    try {
      //await updateImageOrderSchema.validate(data);
      await ApiService.put(`${this.baseUrl}/update-order`, data);
    } catch (error) {
      console.error("Resim sıralaması güncellenirken hata oluştu:", error);
      throw error;
    }
  }
}

export default new GalleryImageService();
