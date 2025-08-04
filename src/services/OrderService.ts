import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { Constants } from "@/core/models/SelectListItemModel";
import { toQueryString } from "@/core/helpers/dom";

export type IOrder = {
  id: string;
  restourantId: string;
  totalPrice: number;
  orderDate: string;
  paymentType: string;
  customerName: string;
  active: number;
};

export default class OrderService {
  public static async getOrders(
    model: IPagination = defaultPagination,
    restourantId: string,
    filters: any = null
  ): Promise<ApiResponse<IOrder>> {
    if (model.orderBy == null) {
      model.orderBy = "orderDate";
      model.direction = "desc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/order/getOrder?id=${restourantId}&${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IOrder>(url);
    return result.data;
  }

  public static async getCompanyOrders(
    model: IPagination = defaultPagination,
    companyId: number,
    filters: any = null
  ): Promise<ApiResponse<IOrder>> {
    if (model.orderBy == null) {
      model.orderBy = "orderDate";
      model.direction = "desc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/order/getCompanyOrder?id=${companyId}&${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IOrder>(url);
    return result.data;
  }

  public static async getTestOrders(
    model: IPagination = defaultPagination
  ): Promise<ApiResponse<IOrder>> {
    if (model.orderBy == null) {
      model.orderBy = "orderDate";
      model.direction = "desc";
    }
    const modelQuery = toQueryString(model);

    const url = `/order/getTestOrder?${modelQuery}`;
    const result = await ApiService.get<IOrder>(url);
    return result.data;
  }

  public static async updateOrder(order: IOrder): Promise<ApiResponse> {
    const result = await ApiService.post(`/order/update`, order);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async bulkUpdateOrder(ids: string[]): Promise<ApiResponse> {
    const result = await ApiService.post(`/order/bulkupdate`, ids);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async getConstants(): Promise<ApiResponse<Constants>> {
    const url = `/order/getConstants`;
    const result = await ApiService.get<Constants>(url);
    return result.data;
  }
}
