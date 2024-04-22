import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/guard/jwt.guard';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post('create/userId/:id/')
  @UseGuards(AuthGuard)
  createEvent(@Param('id') userId: number, @Body() eventData: CreateEventDto) {
    return this.eventsService.createEventUser(userId, eventData)
  }
}
