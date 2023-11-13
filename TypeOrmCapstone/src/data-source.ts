import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Docs } from "./entity/Docs"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "test123",
    database: "academicaidedb",
    synchronize: true,
    logging: false,
    entities: [User,Docs],
    migrations: [],
    subscribers: [],
})
