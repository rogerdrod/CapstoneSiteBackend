import { Bootstrap } from "./bootstrap"
import { AppDataSource } from "./data-source"
import { Docs } from "./entity/Docs"
import { User } from "./entity/User"
import * as fs from 'fs'

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User() 
    user.firstName = "Roger" 
    user.lastName = "Rodulfo" 
    user.password = "Xxbootyeater69_420xX" 
    user.email = "roger@gmail.com" 
    user.userType = 3 
    user.status = null

    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Inserting a new file into the database...")
    const fileContent = fs.readFileSync('C:\\Users\\Roger\\CapstoneSiteBackend\\TypeOrmCapstone\\Assignment4.docx');
    const doc = new Docs()
    doc.file = fileContent

if (user.docs) {
    user.docs.push(doc);
} else {
    user.docs = [doc];
}
    doc.user = user;

    await AppDataSource.manager.save(doc).catch((err) => console.log(err))
    console.log("File uploaded to the database.")


    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")
    
}).catch(error => console.log(error))
