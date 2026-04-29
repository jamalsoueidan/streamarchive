import api from "@/lib/api";
import { MOLLIE_PRICES } from "@/lib/mollie-prices";
import createMollieClient, { SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";

function getMollieClient() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

export async function POST(request: NextRequest) {
  try {
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = currentUser.data as {
      id: number;
      email: string;
      subscriptionStatus?: string;
    };
    const userId = user.id.toString();
    const userEmail = user.email;

    if (user.subscriptionStatus === "active") {
      return NextResponse.json(
        {
          error:
            "You already have an active subscription. Cancel it before starting a new one.",
        },
        { status: 409 },
      );
    }

    const { billingCycle } = await request.json();

    if (!billingCycle || !MOLLIE_PRICES[billingCycle]) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 },
      );
    }

    const plan = MOLLIE_PRICES[billingCycle];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const isTestMode = process.env.MOLLIE_API_KEY!.startsWith("test_");

    // Find or create Mollie customer
    let customer: { id: string } | undefined;
    const customers = await getMollieClient().customers.page();
    for (const c of customers) {
      if ((c.metadata as { userId?: string })?.userId === userId) {
        customer = c;
        break;
      }
    }

    if (!customer) {
      customer = await getMollieClient().customers.create({
        name: userEmail,
        email: userEmail,
        metadata: { userId },
      });
    }

    console.log(`[mollie] customer: ${customer.id} for user ${userId}`);

    // Create first payment to get a mandate
    const payment = await getMollieClient().payments.create({
      amount: { currency: "USD", value: plan.amount },
      description: plan.description,
      redirectUrl: `${baseUrl}/premium?success=true&provider=mollie&mc=${customer.id}`,
      customerId: customer.id,
      sequenceType: SequenceType.first,
      metadata: {
        userId,
        billingCycle,
        interval: plan.interval,
      },
      ...(isTestMode ? {} : { webhookUrl: `${baseUrl}/api/mollie/webhook` }),
    });

    console.log(`[mollie] payment: ${payment.id} status: ${payment.status}`);

    return NextResponse.json({ url: payment.getCheckoutUrl() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Mollie checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
