import { Entity, PrimaryGeneratedColumn, Column, OneToMany, getRepository } from "typeorm"
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

    @Column() /* 0 , 1 ,2  to represent staff, applicant or user*/
    userType: number

    @OneToMany(type => Docs, (doc) => doc.user)
    docs: Docs;

    @Column() /* Nullable */
    status: string
}
