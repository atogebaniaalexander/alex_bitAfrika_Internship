import { DataSource } from "typeorm";
import { config } from "dotenv";


config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "express_boilerplate",

  synchronize: process.env.NODE_ENV === "development",

  logging: process.env.NODE_ENV === "development",
  // Entity classes that TypeORM should manage
  // Add new entity classes to this array as you create them
  entities: [],

  // Migration files location for database schema versioning
  migrations: ["src/migrations/**/*.ts"],

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
