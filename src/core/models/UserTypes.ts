export interface UserType {
  key: number;
  name: string;
}

export const USER_TYPE_NORMAL = 0;
export const USER_TYPE_ASSESSOR = 1;

export const userTypes: UserType[] = [
  {
    key: USER_TYPE_NORMAL,
    name: "Normal",
  },
  {
    key: USER_TYPE_ASSESSOR,
    name: "Değerlendirici",
  },
];
