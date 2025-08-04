import ApiService, { ApiResponse } from "@/core/services/ApiService";
import { IPagination, defaultPagination } from "@/core/models/PageModel";
import { toQueryString } from "@/core/helpers/dom";
import { IRestourant } from "./RestourantService";

export type ICompany = {
  id: number;
  companyName: string;
  companyType: string;
  otherNames: string;
  active: number;
};
export type IIncome = {
  id: number;
  companyId: number;
  incomeType: string;
  price: number;
  incomeExplain: string;
  BankRowDate: string;
  CreatedDate: string;
  companyName: string;
  incomeDate: string;
};
export type IInvoice = {
  id: number;
  companyId: number;
  invoiceNo: number;
  invoiceDate: string;
  price: number;
  mwst: number;
  mwstPrice: number;
  total: number;
  toCompanyName: string;
  toAddress: string;
  toHouseNumber: string;
  toPostCode: string;
  toCity: string;
  createdDate: string;
  items: Array<IInvoiceItems>;
};
export type IInvoiceItems = {
  id: number;
  invoiceId: number;
  piece: number;
  price: number;
  total: number;
  explain: string;
};
export type ICompanyPaymentPlan = {
  id: number;
  companyId: number;
  limit: number;
  price: number;
};

export type ICompanyPayment = {
  id: number;
  companyName: string;
  reportType: string;
  total: number;
  price: number;
};

export type ICompanyIstatistik = {
  companyName: string;
  reportype: string;
  total: number;
  price: number;
};
export default class CompanyService {
  public static async getCompanies(
    model: IPagination = defaultPagination,
    filters: any = null
  ): Promise<ApiResponse<ICompany>> {
    if (model.orderBy == null) {
      model.orderBy = "companyname";
      model.direction = "asc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/company/getCompanies?${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<ICompany>(url);
    return result.data;
  }

  public static async getCompany(id: number): Promise<ApiResponse<ICompany>> {
    const url = `/company/getCompany?id=${id}`;
    const result = await ApiService.get<ICompany>(url);
    return result.data;
  }

  public static async getRestourants(
    id: number
  ): Promise<ApiResponse<IRestourant>> {
    const url = `/company/getRestourants?id=${id}`;
    const result = await ApiService.get<IRestourant>(url);
    return result.data;
  }

  public static async createUpdateCompany(
    company: ICompany
  ): Promise<ApiResponse> {
    const result = await ApiService.post(`/company/createupdate`, company);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async getCompanyPayments(
    filters: any = null
  ): Promise<ApiResponse<ICompanyPayment>> {
    const filterQuery = toQueryString(filters);
    const url = `/company/getCompanyPayments?${filterQuery}`;
    const result = await ApiService.get<ICompanyPayment>(url);
    return result.data;
  }

  public static async getCompanyPaymentPlans(
    id: number
  ): Promise<ApiResponse<ICompanyPaymentPlan>> {
    const url = `/company/getCompanyPaymentPlans?id=${id}`;
    const result = await ApiService.get<ICompanyPaymentPlan>(url);
    return result.data;
  }

  public static async createUpdatePaymentplan(
    payment: ICompanyPaymentPlan
  ): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/company/createupdate/paymentplan`,
      payment
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async getCompanyIstatistik(
    model: IPagination = defaultPagination,
    filters: any = null
  ): Promise<ApiResponse<ICompanyIstatistik>> {
    if (model.orderBy == null) {
      model.orderBy = "companyName";
      model.direction = "asc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/company/getCompanyIstatistik?${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<ICompanyIstatistik>(url);
    return result.data;
  }

  public static async getIncomes(
    model: IPagination = defaultPagination,
    id: number,
    filters: any = null
  ): Promise<ApiResponse<IIncome>> {
    if (model.orderBy == null) {
      model.orderBy = "createdDate";
      model.direction = "desc";
    }

    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/company/getIncomes?id=${
      id == null ? "" : id
    }&${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IIncome>(url);
    return result.data;
  }

  public static async incomeCreateUpdate(
    income: IIncome
  ): Promise<ApiResponse> {
    const result = await ApiService.post(`/company/incomeCreateUpdate`, income);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
  public static async incomeDelete(income: IIncome): Promise<ApiResponse> {
    const result = await ApiService.post(`/company/incomeDelete`, income);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async importExcel(
    file: object
  ): Promise<ApiResponse<ICompany>> {
    const url = `/company/import`;
    const result = await ApiService.post<ICompany>(url, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  public static async saveImport(model: object): Promise<ApiResponse> {
    const url = `/company/saveimport`;
    const result = await ApiService.post(url, model);
    return result.data;
  }

  public static async getInvoice(
    invoiceNo: number | null,
    id: number | null
  ): Promise<ApiResponse<IInvoice>> {
    const url = `/company/getInvoice?id=${id}&invoiceNo=${invoiceNo}`;
    const result = await ApiService.get<IInvoice>(url);
    return result.data;
  }

  public static async getInvoices(
    model: IPagination = defaultPagination,
    id: number,
    filters: any = null
  ): Promise<ApiResponse<IInvoice>> {
    if (model.orderBy == null) {
      model.orderBy = "createdDate";
      model.direction = "desc";
    }
    const modelQuery = toQueryString(model);
    const filterQuery = toQueryString(filters);

    const url = `/company/getInvoices?id=${id}&${modelQuery}&${filterQuery}`;
    const result = await ApiService.get<IInvoice>(url);
    return result.data;
  }

  public static async invoiceCreateUpdate(
    invoice: IInvoice
  ): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/company/invoiceCreateUpdate`,
      invoice
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
  public static async invoiceDelete(invoice: IInvoice): Promise<ApiResponse> {
    const result = await ApiService.post(`/company/invoiceDelete`, invoice);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }

  public static async invoiceItemsCreateUpdate(
    invoice: IInvoiceItems
  ): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/company/invoiceItemsCreateUpdate`,
      invoice
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
  public static async invoiceItemsDelete(
    invoiceItems: IInvoiceItems
  ): Promise<ApiResponse> {
    const result = await ApiService.post(
      `/company/invoiceItemsDelete`,
      invoiceItems
    );
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
  public static async getInvoiceBill(
    qrResponse,
    invoiceNo
  ): Promise<ApiResponse<any>> {
    const result = await ApiService.post(
      `/company/getQrCode?invoiceNo=${invoiceNo}`,
      qrResponse
    );
    return result.data;
  }
}
