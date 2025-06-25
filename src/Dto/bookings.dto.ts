import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDate,
  IsNumber,
} from "class-validator";


export class CreateBookingDto {
  @IsString({ message: "Event ID must be a string" })
  @IsNotEmpty({ message: "Event ID is required" })
  eventId!: string;

  @IsString({ message: "User ID must be a string" })
  @IsNotEmpty({ message: "User ID is required" })
  userId!: string;
 
  @IsNumber({}, { message: "Seats must be a number" })
  @IsNotEmpty({ message: "Seats are required" })
  seats!: number;

  @IsDate({ message: "Booking date must be a valid date" })
  createdAt?: Date;
  
}