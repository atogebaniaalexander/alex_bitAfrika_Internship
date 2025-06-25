import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,

} from "typeorm";
import { Booking } from "./Booking";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description?: string;

  @CreateDateColumn()
  date!: Date;

  @Column()
  totalSeats!: number;

  @Column()
  bookedSeats!: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings!: Booking[];
}
