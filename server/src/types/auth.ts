export type SignInBody = {
  email: string;
  password: string;
};

export type SignUpBody = {
  name: string;
  email: string;
  password: string;
  otp: string;
};
