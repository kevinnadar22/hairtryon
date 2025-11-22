import React from "react";
import { Pricing } from "@/components/Landing/Pricing";

const PricingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <Pricing darkMode={false} showHeader={true} />
    </div>
  );
};

export default PricingPage;
