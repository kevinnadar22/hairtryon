import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import ContinueWithGoogleButton from "./ContinueWithGoogle";
import React from "react";
import { api } from "@/api/client";
import { toast } from "sonner";
import { getVerifySignupUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup: React.FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const { handleGoogleSignIn } = useGoogleAuth();
  const navigate = useNavigate();

  // local states
  const [form, setForm] = React.useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const setFormField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Signup mutation
  const { mutate: signupMutate, isPending: isSignupPending } =
    api.auth.signupApiV1AuthSignupPost.useMutation(undefined, {
      onSuccess: (data) => {
        if (!data.verify_token) {
          toast.error("Signup successful, but no verification token received.");
          return;
        }
        const verifyUrl = getVerifySignupUrl(data.verify_token);
        toast.success(
          "Signup successful! Please verify your email before logging in."
        );
        navigate(verifyUrl);
      },
      onError: (error) => {
        // @ts-ignore
        const msg = error?.detail?.[0]?.msg ?? error?.detail ?? "Login failed";
        toast.error(msg);
      },
    });

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      email: form.email,
      name: form.name,
      password: form.password,
    };

    signupMutate({ body: payload });
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            className="w-full"
            value={form.email}
            onChange={(e) => setFormField("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-name">Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Enter your name"
            className="w-full"
            value={form.name}
            onChange={(e) => setFormField("name", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          className="w-full"
          value={form.password}
          onChange={(e) => setFormField("password", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          placeholder="Confirm your password"
          className="w-full"
          value={form.confirmPassword}
          onChange={(e) => setFormField("confirmPassword", e.target.value)}
        />
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={handleSubmit}
        disabled={isSignupPending}
      >
        {isSignupPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
      </Button>

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

export default Signup;
