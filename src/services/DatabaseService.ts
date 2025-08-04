import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";

export type IDatabase = {
  id: string;
  tagName: string;
  serverName: string;
  dbName: string;
  userName: string;
  password: string;
  active: number;
};

export default class DatabaseService {
  public static async getDatabases(
    model: IPagination = defaultPagination,
    filters: any = null
  ): Promise<ApiResponse<IDatabase>> {
    if (model.orderBy == null) {
      model.orderBy = "tagName";
      model.direction = "asc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/database/getDatabase?${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IDatabase>(url);
    return result.data;
  }

  public static async addUpdateDatabase(
    database: IDatabase
  ): Promise<ApiResponse> {
    const result = await ApiService.post(`/database/add`, database);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
}
