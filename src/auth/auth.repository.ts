import { Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

const logger = new Logger('auth.repository');

@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    async findUserBySocialId(socialId: string): Promise<User> {
			logger.debug('socialId in auth.repository >>>>', socialId);
			return await this.findOne({ socialId: socialId });
    }
}
