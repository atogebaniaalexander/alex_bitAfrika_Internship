import { Request, Response, NextFunction } from "express";
import { UserService } from "../Services/user.service";
import { CreateUserDto, LoginDto } from "@/Dto/user.dto";
import { AuthenticatedRequest,adminOnly } from "../Middlewares/auth.middleware";
import { AuthRole } from "../Dto/auth.dto";


export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    register = async (req: AuthenticatedRequest, res: Response,next: NextFunction): Promise<void> => {
        const userDto = req.body as CreateUserDto;
        
        const userId = req.user.id; // Assuming user ID is available in the request object
        if (!userId) {
            res.status(401).json({ message: "User ID is required" });
            return;
        }
        try {
            // Extract role from authenticated request instead of using middleware directly
            const currentUserRole = await this.userService.isAdmin(userId);

            if(currentUserRole === AuthRole.ADMIN && userDto.role === AuthRole.ADMIN) {

            const { user, token } = await this.userService.createUser(userDto);
            console.log(`New user registered: ${user.email}`);
            
            res.status(201).json({
                status: "success",
                message: "User registered successfully",
                data: {
                    user: user,
                    token: token,
                },
            });
            } else {
                res.status(403).json({
                    status: "error",
                    message: "Only admins can create new admin users",
                });
            }

        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const loginDto = req.body as LoginDto;

        try {
            const { user, token } = await this.userService.login(loginDto.email, loginDto.password);
            console.log(`User logged in: ${user.email}`);
            
            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    user: user,
                    token: token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

}