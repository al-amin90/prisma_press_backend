import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";
import config from "./app/config";
import userRouter from "./app/modules/user/user.route";
import GlobalErrorHandler from "./app/middlewares/GlobalErrorHandler";
import NotFound from "./app/middlewares/NotFound";
import { authRouter } from "./app/modules/auth/auth.route";
import { commentRouter } from "./app/modules/comment/comment.route";
import { postRouter } from "./app/modules/post/post.route";
import subscriptionRouter from "./app/modules/subscription/subscription.route";
import { stripe } from "./lib/stripe";

const app: Application = express();

const endpointSecret = config.stripe_webhook_secret;

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;

    console.log("rq body", event);
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"]!;

      console.log("request.headers", request.headers);
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    console.log("after event", event);

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

// __) parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "x-tenant",
    ],
    exposedHeaders: ["Authorization"],
  }),
);

// __) all application route here
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/subscription", subscriptionRouter);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

app.use(GlobalErrorHandler);
app.use(NotFound);

export default app;
