import { useMutation } from "@tanstack/react-query";
import { signInApi, signUpApi } from "../../services/authservice";
import { SignInFormValues } from "../../../../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signInApi,

    onSuccess: (res: any) => {
      const token = res?.data?.data?.token;

      toast.success("Login successful", {
        duration: 3000,
      });

      if (token) {
        localStorage.setItem("token", token);
      }

      setTimeout(() => {
        navigate("/");
      }, 500);
    },

    onError: (error: any) => {
      toast.error("Invalid Credentials", {
        duration: 1500,
      });
    },
  });
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpApi,

    onSuccess: (res: any) => {
      const token = res?.data?.data?.token;

      toast.success("SignUp successful", {
        duration: 3000,
      });

      if (token) {
        localStorage.setItem("token", token);
      }

      setTimeout(() => {
        navigate("/");
      }, 500);
    },

    onError: (error: any) => {
      toast.error("SignUp Failed", {
        duration: 3000,
      });

      const err = error?.response?.data?.errors?.[0];
      console.log("FINAL ERROR:", JSON.stringify(err, null, 2));
    },
  });
};
