import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import config from "../../config";
import type { Role } from "../../../../generated/prisma/enums";
import { stripe } from "../../../lib/stripe";
import type Stripe from "stripe";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: config.stripe_product_price_key, quantity: 1 }],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });
  return transactionResult;
};

const handlerWebHook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.
      await checkoutComplete(event.data.object);

      break;
    case "customer.subscription.created":
      // Occurs whenever a customer is signed up for a new plan.

      // const paymentMethod = event.data.object;

      break;
    case "customer.subscription.deleted":
      // Occurs whenever a customer’s subscription ends.

      // const paymentMethod = event.data.object;

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);

      break;
  }
};

const getPeriodEnd = async (payload: Stripe.Subscription) => {
  const currentPeriodEndInMilliseconds = payload.items.data[0]
    ?.current_period_start as number;

  return new Date(currentPeriodEndInMilliseconds * 1000);
};

const checkoutComplete = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("web failed");
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

export const subscriptionServices = {
  createCheckoutSession,
  handlerWebHook,
};
