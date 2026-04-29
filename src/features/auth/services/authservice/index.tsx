import { apiClient } from "../../../../lib/apiclient";
import { SignInFormValues, SignUpformValues } from "../../../../types/index";
import { endpoints } from "../../../../lib/endpoints";

export const signInApi = async (data: SignInFormValues) => {
  const res = await apiClient.post(endpoints.signin, data);

  const { token, user } = res.data;

  //  store token
  localStorage.setItem("token", token);

  //  store user
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};

export const signUpApi = async (data: SignUpformValues) => {
  const res = await apiClient.post(endpoints.signup, data);

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return res;
};
