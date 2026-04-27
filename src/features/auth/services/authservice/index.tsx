import { apiClient } from "../../../../lib/apiclient";
import { SignInFormValues, SignUpformValues } from "../../../../types/index";

export const signInApi = async (data: SignInFormValues) => {
  const res = await apiClient.post("/auth/signin", data);

  const { token, user } = res.data;

  //  store token
  localStorage.setItem("token", token);

  //  store user
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};

export const signUpApi = async (data: SignUpformValues) => {
  const res = await apiClient.post("/auth/signup", data);

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};
