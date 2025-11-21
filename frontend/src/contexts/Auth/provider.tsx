import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setAuthStatus, logout } from "@/features";
import { api } from "@/api/client";
import { toast } from "sonner";


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
            name: user.name,
            email: user.email,
            profilePictureUrl: user.userpic,
          },
        })
      );
      dispatch(setAuthStatus("succeeded"));
    }

    if (userQuery.isError) {

        toast.error("Session expired. Please log in again.");

      dispatch(setAuthStatus("succeeded"));
      dispatch(logout());
    }
  }, [userQuery.isSuccess, userQuery.isError, userQuery.data]);

  return children;
};

export { AuthProvider };
