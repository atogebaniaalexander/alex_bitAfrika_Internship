import { Router } from "express";
import { UserController } from "../Controllers/user.controller";
import { authenticate } from "../Middlewares/auth.middleware";
import { validateDto } from "../Middlewares/validation.middleware";
import { CreateUserDto, LoginDto } from "../Dto/user.dto";

const userRouter = Router();
const userController = new UserController();

// userRouter.post(
//     "/register",
//     validateDto(CreateUserDto),
//     userController.register
// );
// userRouter.post("/login", validateDto(LoginDto), userController.login);

// userRouter.use(authenticate);

export default userRouter;
