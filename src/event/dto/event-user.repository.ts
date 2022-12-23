import { EntityRepository, Repository } from "typeorm";
import { EventUser } from "../event-user.entity";
import { CreateEventUserDto } from "./create-event-user.dto";

@EntityRepository(EventUser)
export class EventUserRepository extends Repository<EventUser> {
  async createEventUser(createEventUserDto: CreateEventUserDto): Promise<EventUser> {
    const {
      nickname,
      email
    } = createEventUserDto;

    const eventUser = new EventUser(
      nickname,
      email
    );

    await this.save(eventUser);
    return eventUser;
  }
}
