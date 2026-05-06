import { useMutation } from "@tanstack/react-query";
import { signInApi, signUpApi } from "../../services/authservice";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router-dom";
import { getroleByIdApi } from "../../../roles/services/role-service";
import { setPermissions } from "../../../../redux/reducer/permission-slice/index";

import { useAppDispatch } from "../../../../redux/hook";
import { AuthResponse } from "../../types";

export const useSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: signInApi,
    onSuccess: async (res: AuthResponse) => {
      try {
        console.log("LOGIN RESPONSE:", res?.data);

        const token = res?.data?.token;
        const user = res?.data?.user;

        if (!token || !user) {
          toast.error("Invalid login response");
          return;
        }

        toast.success("Login successful");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        let permissions: any[] = [];

        if (user?.roleId) {
          try {
            const roleRes = await getroleByIdApi(user.roleId);

            permissions =
              roleRes?.data?.data?.permissions ||
              roleRes?.data?.permissions ||
              roleRes?.permissions ||
              [];
          } catch (err) {
            console.error("Role API failed:", err);
          }
        }

        dispatch(setPermissions(permissions || []));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (err) {
        console.error("LOGIN FLOW CRASH:", err);
        toast.error("Something went wrong during login");
      }
    },
    onError: (error) => {
      console.error("LOGIN ERROR:", error);

      Sentry.addBreadcrumb({
        message: "ERRORRRR",
        level: "info",
      });
      Sentry.captureException(error);
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

    onSuccess: (res: AuthResponse) => {
      const token = res?.data?.token;

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

    onError: () => {
      toast.error("SignUp Failed", {
        duration: 3000,
      });
      Sentry.captureMessage("SignUp Failed");
    },
  });
};
