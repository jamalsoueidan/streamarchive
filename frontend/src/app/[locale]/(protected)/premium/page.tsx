import { redirect } from "next/navigation";
import { activateStripePremium } from "./actions";
import { activateMolliePremium } from "./actions/mollie";
import PremiumClient from "./premium-client";

interface PageProps {
  searchParams: Promise<{
    success?: string;
    session_id?: string;
    canceled?: string;
    provider?: string;
    mc?: string;
    error?: string;
  }>;
}

export default async function PremiumPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Handle Mollie success redirect
  if (params.success === "true" && params.provider === "mollie") {
    const result = await activateMolliePremium(params.mc);
    console.log("[mollie-activate]", JSON.stringify(result));
    if (result.success) {
      redirect("/premium");
    }
    redirect(`/premium?error=${encodeURIComponent(result.error || "activation_failed")}`);
  }

  // Handle Stripe success redirect
  if (params.success === "true" && params.session_id) {
    const result = await activateStripePremium(params.session_id);
    if (result.success) {
      redirect("/premium");
    }
    redirect("/premium?error=activation_failed");
  }

  // Handle canceled checkout
  if (params.canceled === "true") {
    redirect("/premium");
  }

  return <PremiumClient paymentError={params.error} />;
}
