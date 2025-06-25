import { Repository } from "typeorm";
import { AppDataSource } from "../Config/database";
import { User } from "../Entities/User";
import { CreateUserDto } from "../Dto/user.dto";
import { AppError } from "../Middlewares/error.middleware";
import { generateToken } from "../Utils/auth";
import { AuthRole } from "@/Dto/auth.dto";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(userDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const user = this.userRepository.create(userDto);

    const savedUser = await this.userRepository.save(user);
    
    const token = generateToken(savedUser);
    if (!token) {
      throw new AppError("Failed to generate token", 500);
    }
    return { user: savedUser, token }; // Return user with token
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "role"], // Select only necessary fields
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

   const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    await this.userRepository.save(user); // Save user to update last login or other fields if needed

    const token = generateToken(user);
    return { user, token };
  }

  async isAdmin(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["role"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user.role;
  }

}
