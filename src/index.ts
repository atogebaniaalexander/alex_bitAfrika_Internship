import "reflect-metadata";

// Core Express.js framework
import express from "express";

// CORS middleware for handling Cross-Origin Resource Sharing
import cors from "cors";

// Helmet for setting various HTTP headers for security
import helmet from "helmet";

// Dotenv for loading environment variables from .env file
import { config } from "dotenv";

import { connectDatabase } from "./Config/database";
import { errorHandler, notFound } from "./Middlewares/error.middleware";

config();

const app = express();

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Allow specific origin
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());

app.use(express.urlencoded());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);


app.use(errorHandler);

const startServer = async (): Promise<void> => {
    try {
      // Establish database connection using TypeORM
      // This will create tables if they don't exist (synchronize: true in dev)
      await connectDatabase();

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Error starting the server:", error);
      process.exit(1); // Exit process if server fails to start
    }
}
