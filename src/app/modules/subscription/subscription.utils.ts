import { prisma } from "../../../lib/prisma";
import { SubscriptionStatus } from "../../../../generated/prisma/enums";
import { stripe } from "../../../lib/stripe";
import type Stripe from "stripe";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndInMilliseconds = payload.items.data[0]
    ?.current_period_start as number;

  return new Date(currentPeriodEndInMilliseconds * 1000);
};

export const checkoutComplete = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("web failed");
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

export const handleChangeSubscription = async (
  payload: Stripe.Subscription,
) => {
  const stripeSubscriptionId = payload.id as string;

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getPeriodEnd(payload);
  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });

  if (!isSubscriptionExist) {
    console.log(`Webhook no subscription for id: ${stripeSubscriptionId}`);
    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};
