import { Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Social } from "./common/Social";
import { User } from "./user.entity";

const logger = new Logger('auth.repository');

@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    async findUserBySocialId(socialId: string): Promise<User> {
			logger.debug('socialId in auth.repository >>>>', socialId);
			return await this.findOne({ socialId: socialId });
    }

    async createUser(user: User): Promise<User> {
        return user.save()
    }
}
