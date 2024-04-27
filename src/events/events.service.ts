import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(EventEntity)
        private eventRepository: Repository<EventEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async getEvents() {
        return await this.eventRepository.find()
    }

    async createEventUser(userId: number, eventBody: CreateEventDto) {
        try {
            // await this.searchUser(userId);>
            const getUser = await this.userRepository.findOne({
                where: { id: userId },
            });
            const instanceNewEvent = this.eventRepository.create({
                user: getUser,
                ...eventBody,
            });

            await this.eventRepository.save(instanceNewEvent);
            return {
                message: 'event created',
                details: instanceNewEvent,
                eventDetails: instanceNewEvent.id,
            };

            // throw new InternalServerErrorException('error interno');
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error.message);
        }
    }
}