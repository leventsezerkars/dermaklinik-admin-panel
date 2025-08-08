import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import AuthenticationService, {
  AuthenticationCredentials,
} from "@/core/services/AuthenticationService";
import router from "../../router";

export interface User {
  id: string;
  nameSurname: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_expires_date: string;
  type: string;
}

export interface UserAuthInfo {
  errors: unknown;
  user: User;
  isAuthenticated: boolean;
}

@Module
export default class AuthModule extends VuexModule implements UserAuthInfo {
  errors = {};
  user = {} as User;
  isAuthenticated = !!JwtService.getToken();

  /**
   * Get current user object
   * @returns User
   */
  get currentUser(): User {
    return this.user;
  }

  /**
   * Verify user authentication
   * @returns boolean
   */
  get isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Get authentification errors
   * @returns array
   */
  get getErrors() {
    return this.errors;
  }

  @Mutation
  [Mutations.SET_ERROR](error) {
    this.errors = { ...error };
  }

  @Mutation
  [Mutations.SET_AUTH](user) {
    this.isAuthenticated = true;
    this.user = user;
    this.errors = {};
    JwtService.saveUser(user);
  }

  @Mutation
  [Mutations.SET_USER](user) {
    this.user = user;
  }

  @Mutation
  [Mutations.PURGE_AUTH]() {
    this.isAuthenticated = false;
    this.user = {} as User;
    this.errors = [];
    JwtService.destroyUser();
  }

  @Action
  async [Actions.LOGIN](credentials: AuthenticationCredentials) {
    const service = new AuthenticationService();
    const result = await service.loginAsync(credentials);

    if (!result.result) {
      this.context.commit(Mutations.SET_ERROR, {
        errorMessage: result.errorMessage,
      });
      return;
    }
    const item = result.entity!;
    const user: User = {
      id: item.UserId,
      email: item.Email,
      token_expires_date: item.expires_date,
      access_token: item.access_token,
      refresh_token: item.refresh_token,
      nameSurname: item.NameSurname,
      type: item.UserType,
    };

    this.context.commit(Mutations.SET_AUTH, user);
  }

  @Action
  [Actions.LOGOUT](redirect: boolean) {
    this.context.commit(Mutations.PURGE_AUTH);
    if (redirect) {
      router.push({ name: "sign-in" });
    }
  }

  @Action
  [Actions.REGISTER](credentials) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        this.context.commit(Mutations.SET_AUTH, data);
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }

  @Action
  [Actions.FORGOT_PASSWORD](payload) {
    return ApiService.post("forgot_password", payload)
      .then(() => {
        this.context.commit(Mutations.SET_ERROR, {});
      })
      .catch(({ response }) => {
        this.context.commit(Mutations.SET_ERROR, response.data.errors);
      });
  }

  @Action
  [Actions.VERIFY_AUTH](payload) {
    //this.context.commit(Mutations.SET_AUTH, fakeuser);
    // if (JwtService.getToken()) {
    //   ApiService.post("verify_token", payload)
    //     .then(({ data }) => {
    //       this.context.commit(Mutations.SET_AUTH, data);
    //     })
    //     .catch(({ response }) => {
    //       this.context.commit(Mutations.SET_ERROR, response.data.errors);
    //       this.context.commit(Mutations.PURGE_AUTH);
    //     });
    // } else {
    //   this.context.commit(Mutations.PURGE_AUTH);
    // }
  }
}
