import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { SelectListItem } from "@/core/models/SelectListItemModel";

export type IPaymentType = {
  id: string;
  titleId: string;
  typeName: string;
  titleName: string;
};

export type IPaymentTypeTitle = {
  id: string;
  title: string;
};

export default class PaymentTypeService {
  public static async getTitles(): Promise<ApiResponse<IPaymentTypeTitle>> {
    const url = `/paymentType/getTitles`;
    const result = await ApiService.get<IPaymentTypeTitle>(url);
    return result.data;
  }

  public static async getTypes(): Promise<ApiResponse<IPaymentTypeTitle>> {
    const url = `/paymentType/getTypes`;
    const result = await ApiService.get<IPaymentTypeTitle>(url);
    return result.data;
  }

  public static async getPaymentTypes(): Promise<
    ApiResponse<Array<SelectListItem>>
  > {
    const url = `/paymentType/getPaymentTypes`;
    const result = await ApiService.get<Array<SelectListItem>>(url);
    return result.data;
  }

  public static async createUpdate(data: IPaymentType): Promise<ApiResponse> {
    const result = await ApiService.post(`/paymentType/createUpdate`, data);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async titleCreateUpdate(
    data: IPaymentTypeTitle
  ): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/paymentType/titleCreateUpdate`,
      data
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
  public static async titleDelete(
    data: IPaymentTypeTitle
  ): Promise<ApiResponse> {
    const result = await ApiService.post(`/paymentType/titleDelete`, data);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async delete(data: IPaymentType): Promise<ApiResponse> {
    const result = await ApiService.post(`/paymentType/delete`, data);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
}
