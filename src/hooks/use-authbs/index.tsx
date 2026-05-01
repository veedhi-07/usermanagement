import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hook";
import { setPermissions } from "../../redux/reducer/permission-slice";
import { getroleByIdApi } from "../../features/roles/services/role-service";

export const useAuthBS = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);
      if (!user?.roleId) return;

      try {
        const roleRes = await getroleByIdApi(user.roleId);

        const permissions =
          roleRes?.data?.data?.permissions ||
          roleRes?.data?.permissions ||
          roleRes?.permissions ||
          [];

        dispatch(setPermissions(permissions));
      } catch (err) {
        console.error("Auth failed", err);
      }
    };

    init();
  }, []);
};
