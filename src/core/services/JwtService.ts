import { User } from "@/store/modules/AuthModule";

const ACCESS_TOKEN_KEY = "access_token" as string;
const REFRESH_TOKEN_KEY = "refresh_token" as string;
const TOKEN_EXPIRE_DATE_KEY = "access_token_expires" as string;
const NAME_KEY = "name" as string;
const EMAIL_KEY = "email" as string;
const TYPE_KEY = "user_type" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUserName = (): string | null => {
  return window.localStorage.getItem(NAME_KEY);
};

export const getUserType = (): number | null => {
  const type = window.localStorage.getItem(TYPE_KEY);
  if (type) return Number(type);
  return 0;
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveUser = (user: User): void => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, user.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, user.refresh_token);
  window.localStorage.setItem(TOKEN_EXPIRE_DATE_KEY, user.token_expires_date);
  window.localStorage.setItem(NAME_KEY, user.nameSurname);
  window.localStorage.setItem(EMAIL_KEY, user.email);
  window.localStorage.setItem(TYPE_KEY, user.type);
};

/**
 * @description remove token form localStorage
 */
export const destroyUser = (): void => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRE_DATE_KEY);
  window.localStorage.removeItem(NAME_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
  window.localStorage.removeItem(TYPE_KEY);
};

export default {
  getToken,
  getRefreshToken,
  saveUser,
  destroyUser,
  getUserName,
  getUserType,
};
