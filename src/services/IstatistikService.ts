import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { toQueryString } from "@/core/helpers/dom";

export type IPaymentList = {
  companyName: string;
  orderDate: string;
  total: number;
};

export interface IIstatistikFilter {
  startEndDate: Array<Date>;
  startDate: string | null;
  endDate: string | null;
  showAll: boolean | null;
  chartDateType: number | null;
  companyId: number | null;
}

export interface IIstatistikPdfContent {
  CompanyName: string;
  StartDate: string;
  EndDate: string;
  Customers: Array<any>;
  Cities: Array<any>;
  MonthPayment: Array<any>;
  WeekPayment: Array<any>;
  DayPayment: Array<any>;
  HourPayment: Array<any>;
  OrderItems: Array<any>;
  PaymentTypes: Array<any>;
  Categories: Array<any>;
}

export default class IstatistikService {
  public static async getListCompanyPayments(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IPaymentList>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getListCompanyPayments?${filterQuery}`;
    const result = await ApiService.get<IPaymentList>(url);
    return result.data;
  }
  public static async getListDailyPayment(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IPaymentList>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getListDailyPayment?${filterQuery}`;
    const result = await ApiService.get<IPaymentList>(url);
    return result.data;
  }

  public static async getListTotalPayments(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IPaymentList>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getListTotalPayments?${filterQuery}`;
    const result = await ApiService.get<IPaymentList>(url);
    return result.data;
  }
  public static async getListNotOrderCompany(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IPaymentList>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getListNotOrderCompany?${filterQuery}`;
    const result = await ApiService.get<IPaymentList>(url);
    return result.data;
  }

  public static async getListCompanyOrderAvg(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IPaymentList>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getListCompanyOrderAvg?${filterQuery}`;
    const result = await ApiService.get<IPaymentList>(url);
    return result.data;
  }

  public static async getTotalPayments(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getTotalPayments?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }
  public static async getNewRestourantCount(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getNewRestourantCount?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }
  public static async getTotalRestourantCount(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getTotalRestourantCount?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }
  public static async getTotalOrderCount(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getTotalOrderCount?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }

  public static async getIstatistikPdfContent(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<IIstatistikPdfContent>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getIstatistikPdfContent?${filterQuery}`;
    const result = await ApiService.get<IIstatistikPdfContent>(url);
    return result.data;
  }
  public static async getTotalIncome(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getTotalIncome?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }
  public static async getTotalIncomePaid(
    filters: IIstatistikFilter
  ): Promise<ApiResponse<number>> {
    const filterQuery = toQueryString(filters);
    const url = `/istatistik/getTotalIncomePaid?${filterQuery}`;
    const result = await ApiService.get<number>(url);
    return result.data;
  }
}
