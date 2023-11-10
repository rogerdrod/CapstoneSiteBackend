import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Docs } from "./Docs"

@Entity({name : "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    email: string

    @Column() /* 0 , 1 ,2  to represent staff, applicant or user*/
    userType: number

    @Column({ nullable: true }) /* Nullable */
    status: string
    
    @OneToMany((type) => Docs, (docs) => docs.user)
    docs: Docs[];
}
