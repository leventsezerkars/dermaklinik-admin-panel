import ApiService, { ApiResponse } from "@/core/services/ApiService";

export type IClientCompany = {
  id: string;
  name: string;
  surname: string;
  companyName: string;
  email: string;
  telephone: string;
  taxNumber: string;
  iban: string;
  bankName: string;
  address: string;
  postCode: string;
  country: string;
  city: string;
  houseNumber: string;
  active: boolean;
  defaultTaxRate: number;
};

export default class ClientCompanyService {
  public static async getClientCompany(): Promise<ApiResponse<IClientCompany>> {
    const url = `/clientCompany/getClientCompany`;
    const result = await ApiService.get<IClientCompany>(url);
    return result.data;
  }

  public static async createUpdate(data: IClientCompany): Promise<ApiResponse> {
    const result = await ApiService.post(`/clientCompany/createUpdate`, data);
    if (result.data) {
      return result.data;
    }

    return { result: true };
  }
}
