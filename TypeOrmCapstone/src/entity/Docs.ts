
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity({name : "docs" })
export class Docs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("longblob")
    file: Buffer;

    @ManyToOne((type) => User, (user) => user.docs)
    user: User; 

}
