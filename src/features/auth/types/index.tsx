export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      phone: string;
      roleId: number;
    };
  };
}
export interface SignInFormValues {
  email: string;
  password: string;
}

export interface SignUpformValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  confirmPassword: string;
}
