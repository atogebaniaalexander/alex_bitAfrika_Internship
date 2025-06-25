import { Request, Response, NextFunction } from "express";


export interface ApiError extends Error {
  statusCode?: number; // HTTP status code for the error
  isOperational?: boolean; // Flag to distinguish operational vs programming errors
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Extract status code and message with defaults
  let { statusCode = 500, message } = error;

  // Log the error with request context for debugging
  // Includes: status code, message, URL, HTTP method, and client IP
  console.log(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // In production, don't expose internal error details to clients
  // Only show generic message for non-operational errors (programming bugs)
  if (process.env.NODE_ENV === "production" && !error.isOperational) {
    message = "Something went wrong!";
  }

  // Send structured error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // Include stack trace only in development for debugging
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Create a 404 error with the requested URL
  const error: ApiError = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;

  // Pass the error to the error handler middleware
  next(error);
};

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  /**
   * Creates a new operational error
   *
   * @param message - Error message to display
   * @param statusCode - HTTP status code for the error
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintain proper stack trace (excludes this constructor from stack)
    Error.captureStackTrace(this, this.constructor);
  }
}
  