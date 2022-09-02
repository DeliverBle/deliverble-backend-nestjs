import { TypeOrmModuleOptions } from "@nestjs/typeorm";
require("dotenv").config();


export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.HOST,
    port: parseInt(process.env.DBPORT),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}
