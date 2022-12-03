import { TypeOrmModuleOptions } from "@nestjs/typeorm";
require("dotenv").config();


export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DBPORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}
