import { Request, Response, NextFunction } from "express";
import { UserService } from "../Services/user.service";
import { CreateUserDto, LoginDto } from "@/Dto/user.dto";
import {
  AuthenticatedRequest,
  adminOnly,
} from "../Middlewares/auth.middleware";
import { AuthRole } from "../Dto/auth.dto";
