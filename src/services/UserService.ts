import ApiService, { ApiResponse } from "@/core/services/ApiService";
import * as yup from "yup";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { UserPermissions } from "@/core/models/UserPermissionsModel";

export const schema = yup.object({
  name: yup.string().required().label("Üye Adı"),
  surname: yup.string().required().label("Üye Soyadı"),
  email: yup.string().email().required().label("Email"),
  title: yup.string().nullable().label("Ünvan"),
  type: yup
    .number()
    .typeError("Bu alan zorunludur")
    .required()
    .label("Üyelik Türü"),
});

export type IUser = yup.InferType<typeof schema>;

export type UserShortInfo = {
  id?: string;
  name: string;
  surname: string;
  email: string;
  title: string | null | undefined;
  type: number;
};

export default class UserService {
  public static async getUsers(
    model: IPagination = defaultPagination
  ): Promise<ApiResponse<UserShortInfo>> {
    let url = `/v1/user/${model.take}/${model.page}`;

    if (model.search) {
      url = `${url}/${model.search}`;
    } else {
      url = `${url}/`;
    }
    const result = await ApiService.get<UserShortInfo>(url);
    return result.data;
  }

  public static async getUser(id: string): Promise<ApiResponse<UserShortInfo>> {
    const result = await ApiService.get<UserShortInfo>(`/v1/user/${id}`);
    if (result.data.result === false) {
      return result.data;
    } else {
      return { result: true, entity: result.data as UserShortInfo };
    }
  }

  public static async getUserPermissions(
    id: string
  ): Promise<ApiResponse<UserPermissions | undefined>> {
    const result = await ApiService.get<UserPermissions>(
      `/v1/user/${id}/permission`
    );
    if (result.data.result === false) {
      return result.data;
    } else {
      return { result: true, entity: result.data as UserPermissions };
    }
  }

  public static async getAuthenticatedUserPermissions(): Promise<
    ApiResponse<string[] | undefined>
  > {
    const result = await ApiService.get<string[]>(`/v1/user/me/permission`);
    if (result.data.result === false) {
      return result.data;
    } else {
      return { result: true, entity: result.data as string[] };
    }
  }

  public static async search(
    search: string
  ): Promise<ApiResponse<UserShortInfo[] | undefined>> {
    const result = await ApiService.get<UserShortInfo[]>(
      `/v1/user/search/${search}`
    );
    return result.data;
  }

  public static async insert(user: UserShortInfo): Promise<ApiResponse> {
    const result = await ApiService.post(`/v1/user`, user);

    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async update(user: UserShortInfo): Promise<ApiResponse> {
    const result = await ApiService.put(`/v1/user`, user);

    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async delete(id: string): Promise<ApiResponse> {
    const result = await ApiService.delete(`/v1/user/${id}`);

    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async deleteBatch(ids: string[]): Promise<ApiResponse> {
    const result = await ApiService.delete(`/v1/user/batch`, ids);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async savePermissions(
    userId: string,
    permissions: string[]
  ): Promise<ApiResponse> {
    const result = await ApiService.put(
      `/v1/user/${userId}/permission`,
      permissions
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
}
