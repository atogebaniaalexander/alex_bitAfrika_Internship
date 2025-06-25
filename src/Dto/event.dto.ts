import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDate,
  IsNumber,
} from "class-validator";

export class CreateEventDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

 @IsDate({ message: "Date must be a valid date" })
  @IsNotEmpty({ message: "Date is required" })
  date!: Date;

  @IsNotEmpty({ message: "Total seats are required" })
  @IsNumber({}, { message: "Total seats must be a number" })
  totalSeats!: number;

  @IsNotEmpty({ message: "Booked seats are required" })
  @IsNumber({}, { message: "Booked seats must be a number" })
  bookedSeats!: number;
}

export class GetEventDto {
  @IsString({ message: "ID must be a string" })
  @IsNotEmpty({ message: "ID is required" })
  id!: string;

  @IsString({ message: "Description must be a string" })
  @IsOptional()
  description?: string;

  @IsDate({ message: "Date must be a valid date" })
  @IsNotEmpty({ message: "Date is required" })
  date!: Date;

  @IsNotEmpty({ message: "Total seats are required" })
  @IsNumber({}, { message: "Total seats must be a number" })
  totalSeats!: number;

  @IsNotEmpty({ message: "Booked seats are required" })
  @IsNumber({}, { message: "Booked seats must be a number" })
  bookedSeats!: number;
}

