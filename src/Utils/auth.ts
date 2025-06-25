import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../Entities/User";
import { AuthRole } from "@/Dto/auth.dto";

export interface JwtPayload {
  userId: string; 
  email: string;
  role: AuthRole;
}

export const generateToken = (user: User): string => {
    // Create payload with essential user information
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role, // Include role if needed
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    // Configure token options
    const options: SignOptions = {
      expiresIn: '24h',  // Token expires in 24 hours for security
    };
  
    // Generate and return signed token
    return jwt.sign(payload, secret, options);
}

export const verifyToken = (token: string): JwtPayload => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};