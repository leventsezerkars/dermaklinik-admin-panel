import axios, { AxiosError } from "axios";
import { LoginSuccessModel } from "../models/LoginSuccessModel";
import { ApiResponse } from "./ApiService";

export type AuthenticationCredentials = {
  flow: "password" | "refreshToken";
  email: string;
  password: string;
  refreshToken: string;
};

class AuthenticationService {
  private apiUrl = process.env.VUE_APP_API_BASE_URL;

  loginAsync = async (
    credentials: AuthenticationCredentials
  ): Promise<ApiResponse<LoginSuccessModel>> => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let model = "";

    if (credentials.flow == "password") {
      model = `grant_type=password&username=${encodeURIComponent(
        credentials.email
      )}&password=${encodeURIComponent(
        credentials.password
      )}&client_id=assessment-platform`;
    } else if (credentials.flow == "refreshToken") {
      model = `grant_type=refresh_token&refresh_token=${credentials.refreshToken}&client_id=assessment-platform`;
    }
    try {
      const response = await axios.post(`${this.apiUrl}/auth/token`, model, {
        headers: headers,
      });

      const userData: LoginSuccessModel = {
        Email: response.data!.Email,
        UserId: response.data!.UserId,
        access_token: response.data!.access_token,
        expires_date: response.data!.expires_date,
        refresh_token: response.data!.refresh_token,
        NameSurname: response.data!.NameSurname,
        UserType: response.data!.UserType,
      };

      return { result: true, entity: userData };
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = (err.response as any).data!.error_description;

      return { result: false, errorMessage: errorMessage };
    }
  };
}

export default AuthenticationService;
