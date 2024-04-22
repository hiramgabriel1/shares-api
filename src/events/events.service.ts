import { Injectable } from '@nestjs/common';
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

    async createEventUser(userId: number, eventData: CreateEventDto) {
        try {
            
        } catch (error) {

        }
    }
}
