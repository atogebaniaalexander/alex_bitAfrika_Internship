import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";


export const validateDto = (dtoClass: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
    
      const dto = plainToInstance(dtoClass, req.body);

      // Run all validation decorators on the DTO instance
      const errors = await validate(dto);

      // Check if validation errors exist
      if (errors.length > 0) {
        // Format validation errors into a user-friendly structure
        const errorMessages = errors.map((error) => ({
          property: error.property, // Field name that failed validation
          constraints: error.constraints, // Object containing all constraint failures
        }));

        // Return 400 Bad Request with detailed validation errors
        res.status(400).json({
          message: "Validation failed",
          errors: errorMessages,
        });
        return;
      }

      
      req.body = dto;

      
      next();
    } catch (error) {
        console.error("Validation error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  };
};