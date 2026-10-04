export interface User {
  _id: string;
  id: number;
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  ein?: string;
  ssn?: string;
  university?: string;
  role?: string;
  ip?: string;
  macAddress?: string;
  userAgent?: string;
  address?: Address;
  bank?: Bank;
  company?: Company;
  crypto?: Crypto;
  hair?: Hair;
}

export interface Address {
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  country?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  lat?: number;
  lng?: number;
}

export interface Bank {
  cardExpire?: string;
  cardNumber?: string;
  cardType?: string;
  currency?: string;
  iban?: string;
}

export interface Company {
  department?: string;
  name?: string;
  title?: string;
  address?: Address;
}

export interface Crypto {
  coin?: string;
  wallet?: string;
  network?: string;
}

export interface Hair {
  color?: string;
  type?: string;
}

export interface UsersResponse {
  users?: User[];
  total?: number;
  skip?: number;
  limit?: number;
}

export enum UserDetailTab {
  ABOUT = "about",
  WORK_AND_LIFE = "work_and_life",
  FINANCIAL = "financial",
  SECURITY = "security",
  SERVICES = "services",
  REVIEW = "review",
  CART = "cart",
}
