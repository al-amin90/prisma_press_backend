import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import cors from "cors";

const app: Application = express();

// __) parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://kidshutbd.com"],
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
// app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send(`This app listening on port ${3000}`);
});

// app.use(GlobalErrorHandler);
// app.use(NotFound);

export default app;
