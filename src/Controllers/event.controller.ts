import { Request, Response, NextFunction } from "express";
import { UserService } from "../Services/user.service";
import { EventService } from "../Services/event.service";
import { CreateUserDto, LoginDto } from "@/Dto/user.dto";
import { CreateEventDto, GetEventDto } from "../Dto/event.dto";
import {AuthenticatedRequest,adminOnly,} from "../Middlewares/auth.middleware";
import { AuthRole } from "../Dto/auth.dto";

export class EventController {
    private eventService: EventService;
    private userService: UserService;

    constructor() {
        this.eventService = new EventService();
        this.userService = new UserService();
    }

    create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const eventDto = req.body as CreateEventDto;
        const userId = req.user.id; // Assuming user ID is available in the request object
        if (!userId) {
            res.status(401).json({ message: "User ID is required" });
            return;
        }
        const currentUserRole = await this.userService.isAdmin(userId);
        if (currentUserRole !== AuthRole.ADMIN) {
            res.status(403).json({
                status: "error",
                message: "Only admins can create events",
            });
            return;
        }
        try {
            const event = await this.eventService.createEvent(eventDto);
            res.status(201).json({
                status: "success",
                message: "Event created successfully",
                data: {
                    event: event,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    getAllEventsPaginated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
    }
    getAvailableSeatsForAnEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const eventId = req.params.id;
        try {
            const availableSeats = await this.eventService.getAvailableSeatsForAnEvent(
              eventId
            );
           if( availableSeats < 0) {
                res.status(404).json({
                    status: "error",
                    message: "Event not found or no available seats",
                });
            } else {
                res.status(200).json({
                    status: "success",
                    data: {
                        availableSeats: availableSeats,
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    }
}
