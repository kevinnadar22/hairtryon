import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/app/store";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import ContinueWithGoogleButton from "./ContinueWithGoogle";
import React, { useEffect } from "react";
import { api } from "@/api/client";
import { toast } from "sonner";
import {
  getErrorMessage,
  getVerifyLoginUrl,
  getVerifySignupUrl,
} from "@/utils";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const { handleGoogleSignIn } = useGoogleAuth();
  const navigate = useNavigate();

  // state for login form inputs could be added here
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isPending, setIsPending] = React.useState(false);

  const { mutate: requestSignupToken, isPending: isRequestingSignupToken } =
    api.auth.requestSignupTokenApiV1AuthRequestSignupTokenPost.useMutation(
      undefined,
      {
        onSuccess: (data) => {
          toast.success("Verification email sent. Please check your inbox.");
          const verifyEmailUrl = getVerifySignupUrl(data.token);
          navigate(verifyEmailUrl);
        },
        onError: (error) => {
          const msg = getErrorMessage(
            error,
            "Failed to send verification email"
          );
          toast.error(msg);
        },
      }
    );

  const { mutate: checkEmailStatus, isPending: isCheckingEmailStatus } =
    api.auth.checkEmailStatusApiV1AuthCheckEmailStatusPost.useMutation(
      undefined,
      {
        onSuccess: (data) => {
          const verified = data.verified;
          if (!verified) {
            requestSignupToken({ body: { email } });
          }
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              "An error occurred while checking email status"
            )
          );
        },
      }
    );

  const { mutate: login, isPending: isLoggingIn } =
    api.auth.requestLoginTokenApiV1AuthRequestLoginTokenPost.useMutation(
      undefined,
      {
        onSuccess: (data) => {
          const verifyLoginUrl = getVerifyLoginUrl(data.token);
          navigate(verifyLoginUrl);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Login failed"));
          checkEmailStatus({ body: { email } });
        },
      }
    );

  useEffect(() => {
    setIsPending(
      isLoggingIn || isRequestingSignupToken || isCheckingEmailStatus
    );
  }, [isLoggingIn, isRequestingSignupToken, isCheckingEmailStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    login({ body: { email: email, password } });
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Login"}
      </Button>

      <div className="flex justify-end mt-2">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-foreground/60">
          or
        </span>
      </div>

      <ContinueWithGoogleButton
        authStatus={authStatus}
        onClick={handleGoogleSignIn}
      />
    </div>
  );
};

export default Login;
