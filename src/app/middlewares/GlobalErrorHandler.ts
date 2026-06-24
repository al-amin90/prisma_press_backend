import type { ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";

const GlobalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something Went Wrong!";
  let errorSources;

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  console.log(":) Global bro", err);

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // err,
    stack: err.stack,
  });
};

export default GlobalErrorHandler;
