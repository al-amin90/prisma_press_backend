import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/AppError";
import config from "../../config";
import type { Role } from "../../../../generated/prisma/enums";
import { stripe } from "../../../lib/stripe";

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
      const paymentIntent = event.data.object;

      break;
    case "customer.subscription.created":
      // Occurs whenever a customer is signed up for a new plan.

      const paymentMethod = event.data.object;

      break;
    case "customer.subscription.deleted":
      // Occurs whenever a customer’s subscription ends.

      const paymentMethod = event.data.object;

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);

      break;
  }
};
export const subscriptionServices = {
  createCheckoutSession,
  handlerWebHook,
};
