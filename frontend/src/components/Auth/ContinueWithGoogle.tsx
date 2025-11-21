import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Loader2Icon } from "lucide-react";

const ContinueWithGoogleButton: React.FC<{
  authStatus: string;
  onClick: () => void;
}> = ({ authStatus, onClick }) => {
  return authStatus === "loading" ? (
    <Button
      disabled
      variant="outline"
      className="w-full flex items-center justify-center gap-2 opacity-90"
    >
      <Loader2Icon className="w-5 h-5 animate-spin" />
      <span>Loading...</span>
    </Button>
  ) : (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
    >
      <FaGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default ContinueWithGoogleButton;
