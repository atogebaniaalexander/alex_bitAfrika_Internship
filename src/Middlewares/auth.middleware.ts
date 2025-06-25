import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../Config/database";
import { User } from "../Entities/User";
import { verifyToken, JwtPayload } from "../Utils/auth";
import { UserService } from "../Services/user.service";
import { AuthRole } from "@/Dto/auth.dto";
export interface AuthenticatedRequest extends Request {
  user: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is required" });
      return;
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.split(" ")[1];

    // Validate token exists after Bearer prefix
    if (!token) {
      res.status(401).json({ message: "Token is required" });
      return;
    }

    // Verify JWT token and decode payload
    // This will throw an error if token is invalid or expired
    const decoded: JwtPayload = verifyToken(token);

    // Get user repository for database operations
    const userRepository = AppDataSource.getRepository(User);

    // Look up user by ID from JWT payload
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });

  
    if (!user) {
      res.status(401).json({ message: "Invalid token or user not found" });
      return;
    }
   
    req.user = user;

    
    next();
  } catch (error) {
    
    res.status(401).json({ message: "Invalid token" });
  }

}

export  const adminOnly = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<string> => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is required" });
      return "Authorization header is required";
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.split(" ")[1];

    // Validate token exists after Bearer prefix
    if (!token) {
      res.status(401).json({ message: "Token is required" });
      return "Token is required";
    }

    // Verify JWT token and decode payload
    // This will throw an error if token is invalid or expired
    const decoded: JwtPayload = verifyToken(token);
    const isAdmin =  decoded.role === AuthRole.ADMIN;
    if (!isAdmin) {
      res.status(403).json({ message: "Access denied. Admins only." });
      return "Access denied. Admins only.";
    }
    return decoded.role;
  }catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return "Invalid token";
  }

}

