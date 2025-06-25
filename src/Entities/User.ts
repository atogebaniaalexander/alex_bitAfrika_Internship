import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,

} from "typeorm";
import bcrypt from "bcrypt";
import { Booking } from "./Booking";
import { AuthRole } from "@/Dto/auth.dto";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false, nullable: true })
  password!: string;

  @Column({
    type: "enum",
    enum: AuthRole,
    default: AuthRole.USER,
  })
  role: AuthRole = AuthRole.USER; // Default role is user
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Get bcrypt rounds from environment or use secure default
      const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12");

      // Hash the password with salt rounds
      this.password = await bcrypt.hash(this.password, rounds);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    // Return false if no password is set (OAuth-only account)
    if (!this.password) {
      return false;
    }

    return bcrypt.compare(plainPassword, this.password);
  }

  hasPassword(): boolean {
    return !!this.password;
  }

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];
}