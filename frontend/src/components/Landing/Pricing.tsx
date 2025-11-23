import React, { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { CreditPurchaseModal } from "../Payments/CreditPurchaseModal";
import { LoginPopup } from "../Auth/LoginPopup";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  href?: string;
}

interface PricingProps {
  darkMode?: boolean;
  showHeader?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "₹0",
    description: "Perfect for testing the waters.",
    features: ["2 Images Total (Lifetime)"],
    href: "/try",
  },
  {
    name: "Pay As You Go",
    price: "₹1",
    description: "Pay only for what you generate.",
    popular: true,
    features: ["Per Image Cost", "HD 4K Downloads", "Commercial Usage Rights"],
  },
  {
    name: "Custom Volume",
    price: "Custom",
    description: "For salons and high volume.",
    features: [
      "Bulk Processing Discounts",
      "API Access Integration",
      "Team Management",
    ],
    href: "/contact",
  },
];

export const Pricing: React.FC<PricingProps> = ({
  darkMode = true,
  showHeader = true,
}) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleButtonClick = (tier: PricingTier) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    if (!tier.href) {
      setShowModal(true);
    } else {
      navigate(tier.href);
    }
  };

  const bgClass = darkMode
    ? "bg-slate-900 text-white"
    : "bg-white text-slate-900";
  const cardBgClass = darkMode ? "bg-slate-800/50" : "bg-slate-50";
  const cardBorderClass = darkMode ? "border-slate-700" : "border-slate-200";
  const cardTextClass = darkMode ? "text-slate-200" : "text-slate-700";
  const cardHoverClass = darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const descriptionClass = darkMode ? "text-slate-400" : "text-slate-500";
  const popularBgClass = darkMode
    ? "bg-white text-slate-900"
    : "bg-white text-slate-900";
  const popularDescriptionClass = darkMode
    ? "text-slate-500"
    : "text-slate-500";

  return (
    <>
      <section
        id="pricing"
        className={`py-24 ${bgClass} relative overflow-hidden`}
      >
        {/* Abstract BG */}
        {darkMode && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
          </div>
        )}

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {showHeader && (
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className={`${descriptionClass} text-lg`}>
                Start for free, then pay only for what you use.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border flex flex-col h-full ${tier.popular
                    ? `${popularBgClass} border-transparent shadow-2xl shadow-primary/50 scale-105 z-10`
                    : `${cardBgClass} ${cardBorderClass} ${cardTextClass} ${cardHoverClass} transition-colors`
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg flex items-center gap-1">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p
                  className={`text-sm mb-6 ${tier.popular ? popularDescriptionClass : descriptionClass
                    }`}
                >
                  {tier.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.name === "Pay As You Go" && (
                    <span
                      className={`text-sm font-medium ${tier.popular
                          ? popularDescriptionClass
                          : descriptionClass
                        }`}
                    >
                      / image
                    </span>
                  )}
                </div>

                <ul className="space-y-4 mb-8 grow">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check
                        size={18}
                        className={
                          tier.popular
                            ? "text-primary shrink-0 mt-0.5"
                            : "text-primary/60 shrink-0 mt-0.5"
                        }
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? "primary" : "outline"}
                  className={`w-full ${!tier.popular
                      ? darkMode
                        ? "border-slate-600 text-white hover:border-white hover:text-white"
                        : "border-slate-300 text-slate-700 hover:border-primary hover:text-primary"
                      : ""
                    }`}
                  onClick={() => handleButtonClick(tier)}
                >
                  {tier.name === "Custom Volume"
                    ? "Contact Sales"
                    : "Get Started"}
                </Button>
              </div>
            ))}
          </div>

          <div
            className={`mt-16 flex flex-col md:flex-row justify-center items-center gap-6 ${descriptionClass} text-sm`}
          >
            <div
              className={`hidden md:block w-1 h-1 ${darkMode ? "bg-slate-700" : "bg-slate-300"
                } rounded-full`}
            />
            <div>Secure payment processing via DoDopayment.</div>
          </div>
        </div>
      </section>

      <CreditPurchaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
};

