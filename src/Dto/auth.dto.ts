import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsArray,
  Length,
  Matches,
} from "class-validator";

export enum AuthRole {
    USER = "user",
    ADMIN = "admin",
}