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
    pasword: string

    @Column()
    email: string

    @Column()
    userType: number

    @OneToMany(type => Docs, (doc) => doc.user)
    docs: Docs; 
}
