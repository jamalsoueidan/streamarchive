"use server";

import { getRoleIdByName } from "@/app/api/freemius/utils";
import api from "@/lib/api";
import publicApi from "@/lib/public-api";
import createMollieClient from "@mollie/api-client";
import { revalidatePath } from "next/cache";

function getMollieClient() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

interface ActivateMollieResult {
  success: boolean;
  error?: string;
}

export async function activateMolliePremium(
  customerId?: string,
): Promise<ActivateMollieResult> {
  try {
    const { data: user } =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    console.log("[mollie-activate] user:", user.id, "customerId:", customerId);

    // Already premium via Mollie
    if (
      user.subscriptionStatus === "active" &&
      user.paymentProvider === "mollie"
    ) {
      return { success: true };
    }

    // Use customer ID from redirect URL, or from stored data
    const mollieCustomerId =
      customerId ||
      (user.mollie ? JSON.parse(user.mollie).customerId : null);

    if (!mollieCustomerId) {
      return { success: false, error: "No Mollie customer found" };
    }

    // Find the paid first payment using SDK
    const payments = await getMollieClient().customerPayments.page({
      customerId: mollieCustomerId,
    });

    console.log(
      "[mollie-activate] payments:",
      payments.map((p) => `${p.id}:${p.status}:${p.sequenceType}`),
    );

    // Check the MOST RECENT first payment — not any old one
    const latestFirstPayment = payments.find(
      (p) => p.sequenceType === "first",
    );

    if (!latestFirstPayment) {
      return { success: false, error: "No payment found" };
    }

    console.log("[mollie-activate] latest first payment:", latestFirstPayment.id, "status:", latestFirstPayment.status);

    if (latestFirstPayment.status !== "paid") {
      return { success: false, error: `Payment ${latestFirstPayment.status}` };
    }

    const paidPayment = latestFirstPayment;

    const metadata = paidPayment.metadata as {
      billingCycle?: string;
      interval?: string;
    } | null;
    const billingCycle = metadata?.billingCycle || "monthly";
    const interval = metadata?.interval || "1 month";

    // Check if subscription already exists
    const subs = await getMollieClient().customerSubscriptions.page({
      customerId: mollieCustomerId,
    });
    let subscriptionId = subs.find((s) => s.status === "active")?.id;

    // In test mode webhooks don't fire, so create subscription here if missing
    if (!subscriptionId) {
      const isTestMode = process.env.MOLLIE_API_KEY!.startsWith("test_");
      if (isTestMode) {
        const prices: Record<string, string> = {
          monthly: "15.00",
          quarterly: "30.00",
          annual: "96.00",
        };
        try {
          const sub = await getMollieClient().customerSubscriptions.create({
            customerId: mollieCustomerId,
            amount: {
              currency: "USD",
              value: prices[billingCycle] || "15.00",
            },
            interval,
            description: `StreamArchive Premium - ${billingCycle}`,
          });
          subscriptionId = sub.id;
          console.log("[mollie-activate] created test subscription:", sub.id);
        } catch (e) {
          console.error("[mollie-activate] failed to create subscription:", e);
        }
      }
    }

    // Calculate end date
    const endDate = new Date();
    switch (interval) {
      case "1 month":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "3 months":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "12 months":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const premiumRoleId = await getRoleIdByName("premium");
    if (!premiumRoleId) {
      return { success: false, error: "Premium role not found" };
    }

    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        role: premiumRoleId,
        subscriptionStatus: "active",
        subscriptionEndDate: endDate.toISOString(),
        billingPeriod: billingCycle,
        paymentProvider: "mollie",
        mollie: JSON.stringify({
          customerId: mollieCustomerId,
          subscriptionId: subscriptionId || null,
          paymentId: paidPayment.id,
        }),
      } as never,
    );

    return { success: true };
  } catch (error) {
    console.error("Mollie activation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to activate premium",
    };
  }
}

export async function cancelMollieSubscription(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { data: user } =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const mollieData = user.mollie ? JSON.parse(user.mollie) : null;
    console.log("[mollie-cancel] data:", JSON.stringify(mollieData));

    if (!mollieData?.customerId || !mollieData?.subscriptionId) {
      return { success: false, error: "No active subscription found" };
    }

    console.log("[mollie-cancel] cancelling subscription:", mollieData.subscriptionId);
    await getMollieClient().customerSubscriptions.cancel(
      mollieData.subscriptionId,
      { customerId: mollieData.customerId },
    );
    console.log("[mollie-cancel] cancelled on Mollie");

    await publicApi.usersPermissionsUsersRoles.usersUpdate(
      { id: user.id.toString() },
      {
        subscriptionStatus: "cancelled",
      } as never,
    );

    console.log("[mollie-cancel] user updated in Strapi");
    revalidatePath("/premium");
    return { success: true };
  } catch (error) {
    console.error("Mollie cancel error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel subscription",
    };
  }
}
