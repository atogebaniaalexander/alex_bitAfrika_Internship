import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";
import { Event } from "./Event";
@Entity("Bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  seats!: number;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  user!: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event!: Event;
}
