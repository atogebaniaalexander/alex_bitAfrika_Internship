import { Repository } from "typeorm";
import { AppDataSource } from "../Config/database";
import { User } from "../Entities/User";
import { Event } from "@/Entities/Event";
import { CreateUserDto } from "../Dto/user.dto";
import {CreateEventDto, GetEventDto} from "../Dto/event.dto";
import { AppError } from "../Middlewares/error.middleware";
import { generateToken } from "../Utils/auth";
import { AuthRole } from "@/Dto/auth.dto";

export class EventService {
  private eventRepository: Repository<Event>;

  constructor() {
    this.eventRepository = AppDataSource.getRepository(Event);
  }

  async createEvent(eventDto: CreateEventDto): Promise<Event> {

    const event = this.eventRepository.create(eventDto);
    return await this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEventById(id: string): Promise<Event | null> {
    return await this.eventRepository.findOne({
      where: { id },
    });
  }

  async getAvailableSeatsForAnEvent(eventId: string): Promise<number> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }
    
    // Assuming 'totalSeats' is the total number of seats for the event
    // and 'bookedSeats' is the number of seats already booked
    return event.totalSeats - event.bookedSeats;
    

  }


}