
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity({name : "docs" })
export class Docs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    file_path: string;

    @ManyToOne((type) => User, (user) => user.docs)
    user: User; 

}
