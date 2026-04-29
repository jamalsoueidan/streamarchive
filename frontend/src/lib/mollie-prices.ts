export const MOLLIE_PRICES: Record<
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
