import axios, { AxiosError } from "axios";
import { LoginSuccessModel } from "../models/LoginSuccessModel";
import { ApiResponse } from "./ApiService";
import AuthService, { type LoginDto } from "@/services/AuthService";

export type AuthenticationCredentials = {
  flow: "password" | "refreshToken";
  email: string;
  password: string;
  refreshToken: string;
};

class AuthenticationService {
  loginAsync = async (
    credentials: AuthenticationCredentials
  ): Promise<ApiResponse<LoginSuccessModel>> => {
    try {
      // Yeni API'yi kullan
      const loginRequest: LoginDto = {
        username: credentials.email, // credentials.email aslında username
        password: credentials.password,
      };

      const response = await AuthService.login(loginRequest);

      if (response.result && response.data) {
        // Yeni API response'unu eski formata dönüştür
        const userData: LoginSuccessModel = {
          Email: response.data.user.email || credentials.email,
          UserId: response.data.user.id || "",
          access_token: response.data.token,
          expires_date: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(), // 24 saat
          refresh_token: "", // Yeni API'de refresh token yok
          NameSurname: `${response.data.user.firstName || ""} ${
            response.data.user.lastName || ""
          }`.trim(),
          UserType: "User",
        };

        return { result: true, data: userData };
      } else {
        return {
          result: false,
          errorMessage:
            response.message || response.errorMessage || "Giriş başarısız",
        };
      }
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "Giriş sırasında hata oluştu";

      if (err.response?.data) {
        const responseData = err.response.data as any;
        errorMessage =
          responseData.message || responseData.errorMessage || errorMessage;
      }

      return { result: false, errorMessage: errorMessage };
    }
  };
}

export default AuthenticationService;
