import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { Constants } from "@/core/models/SelectListItemModel";
import { toQueryString } from "@/core/helpers/dom";

export type IRestourant = {
  id: string;
  name: string;
  webDomain: string;
  dbname: string;
  menuLink: string;
  appType: string;
  active: number;
  databaseId: number;
  prefix: string;
  lastOrderDate: string;
  createdDate: string;
  controlledDate: string;
  androidAppLink: string;
  iOSAppLink: string;
};

export type IRestourantIstatistik = {
  name: string;
  appType: string;
  orderCount: number;
  orderTotal: number;
};

export default class RestourantService {
  public static async getRestourants(
    model: IPagination = defaultPagination,
    filters: any = null
  ): Promise<ApiResponse<IRestourant>> {
    if (model.orderBy == null) {
      model.orderBy = "name";
      model.direction = "asc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/restourant/getRestourant?${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IRestourant>(url);
    return result.data;
  }

  public static async updateRestourant(
    restourant: IRestourant
  ): Promise<ApiResponse> {
    const result = await ApiService.post(`/restourant/update`, restourant);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async getConstants(): Promise<ApiResponse<Constants>> {
    const url = `/restourant/getConstants`;
    const result = await ApiService.get<Constants>(url);
    return result.data;
  }
  public static async getLastOrderUpdateTime(): Promise<ApiResponse<Date>> {
    const url = `/restourant/getLastOrderUpdateTime`;
    const result = await ApiService.get<Date>(url);
    return result.data;
  }
  public static async getRestourantIstatistik(
    model: IPagination = defaultPagination,
    filters: any = null
  ): Promise<ApiResponse<IRestourantIstatistik>> {
    if (model.orderBy == null) {
      model.orderBy = "orderTotal";
      model.direction = "desc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/restourant/getRestourantIstatistik?${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IRestourantIstatistik>(url);
    return result.data;
  }
}
