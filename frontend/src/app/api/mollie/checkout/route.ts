import api from "@/lib/api";
import createMollieClient, { SequenceType } from "@mollie/api-client";
import { NextRequest, NextResponse } from "next/server";

function getMollieClient() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });
}

const PRICES: Record<
  string,
  { amount: string; description: string; interval: string }
> = {
  monthly: {
    amount: "18.00",
    description: "StreamArchive Premium - Monthly",
    interval: "1 month",
  },
  quarterly: {
    amount: "36.00",
    description: "StreamArchive Premium - Quarterly",
    interval: "3 months",
  },
  annual: {
    amount: "120.00",
    description: "StreamArchive Premium - Annual",
    interval: "12 months",
  },
};

export async function POST(request: NextRequest) {
  try {
    const currentUser =
      await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles({});

    if (!currentUser?.data?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = currentUser.data as { id: number; email: string };
    const userId = user.id.toString();
    const userEmail = user.email;

    const { billingCycle } = await request.json();

    if (!billingCycle || !PRICES[billingCycle]) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 },
      );
    }

    const plan = PRICES[billingCycle];
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
