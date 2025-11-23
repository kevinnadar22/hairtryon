import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setAuthStatus, logout } from "@/features";
import { api } from "@/api/client";
import { toast } from "sonner";
import { getErrorCode, getErrorMessage } from "@/utils";


interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  const userQuery = api.user.readCurrentUserApiV1UserMeGet.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,

  });

  useEffect(() => {
    dispatch(setAuthStatus("loading"));

    if (userQuery.isSuccess && userQuery.data) {
      const user = userQuery.data;
      dispatch(
        login({
          user: {
            credits: user.credits,
            name: user.name,
            email: user.email,
            profilePictureUrl: user.userpic,
          },
        })
      );
      dispatch(setAuthStatus("succeeded"));
    }

    if (userQuery.isError) {
      const errCode = getErrorCode(userQuery.error);

      if (errCode != "NO_COOKIES_FOUND") {
        toast.error("Session expired, please login again");
      }
      
      dispatch(setAuthStatus("succeeded"));
      dispatch(logout());
    }
  }, [userQuery.isSuccess, userQuery.isError, userQuery.data]);

  return children;
};

export { AuthProvider };
