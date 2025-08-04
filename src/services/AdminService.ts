import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { IOrder } from "./OrderService";
import { IRestourant } from "./RestourantService";
export default class AdminService {
  public static async InsertRestourants(): Promise<ApiResponse<IRestourant>> {
    const url = `/admin/InsertRestourants`;
    const result = await ApiService.post<IRestourant>(url, null);
    return result.data;
  }
  public static async InsertOrders(): Promise<ApiResponse<IOrder>> {
    const url = `/admin/InsertOrders`;
    const result = await ApiService.post<IOrder>(url, null);
    return result.data;
  }
  public static async InsertSelectedRestourantOrders(
    id: string
  ): Promise<ApiResponse<IOrder>> {
    const url = `/admin/InsertSelectedRestourantOrder`;
    const result = await ApiService.post<IOrder>(url + "?id=" + id, null);
    return result.data;
  }

  public static async InsertSelectedCompanyOrders(
    id: number
  ): Promise<ApiResponse<IOrder>> {
    const url = `/admin/InsertSelectedCompanyOrder`;
    const result = await ApiService.post<IOrder>(url + "?id=" + id, null);
    return result.data;
  }

  public static async requestHost(): Promise<ApiResponse> {
    const url = `/admin/requestHost`;
    const result = await ApiService.get<IOrder>(url);
    return result.data;
  }
}
