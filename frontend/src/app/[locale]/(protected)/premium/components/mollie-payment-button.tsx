"use client";

import { Button, ButtonProps } from "@mantine/core";
import { useState } from "react";

interface MolliePaymentButtonProps extends Omit<ButtonProps, "onClick"> {
  billingCycle: "monthly" | "quarterly" | "annual";
  planLabel: string;
  onError?: (error: string) => void;
}

export function MolliePaymentButton({
  billingCycle,
  planLabel,
  onError,
  children,
  ...buttonProps
}: MolliePaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);


    try {
      const response = await fetch("/api/mollie/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Mollie checkout error:", error);
      onError?.(
        error instanceof Error ? error.message : "Failed to start checkout",
      );
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} loading={loading} {...buttonProps}>
      {children}
    </Button>
  );
}
