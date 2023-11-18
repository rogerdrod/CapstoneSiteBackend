
import { AppDataSource } from "./data-source"
import { Docs } from "./entity/Docs"
import { User } from "./entity/User"
import * as fs from 'fs'
import * as express from "express"
import { Request, Response } from "express"

const app = express()
app.use(express.json())

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User() 
    user.firstName = "Ed" 
    user.lastName = "Gonz" 
    user.password = "pee" 
    user.email = "ed@gmail.com" 
    user.userType = 1 
    user.status = null

    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)


    console.log("Inserting a new file into the database...")
    const fileConent = fs.readFileSync('C:\\Users\\denri\\Documents\\What is culture.docx');
    const doc = new Docs()
    doc.file = fileConent
  
/*
if (user.docs) {
    user.docs.push(doc);
} else {
    user.docs = [doc];
}

    await AppDataSource.manager.save(doc).catch((err) => console.log(err))
    console.log("File uploaded to the database.")
*/

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

    // register routes


// establish database connection


// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/users", async function (req: Request, res: Response) {
    const users = await AppDataSource.getRepository(User).find()
    res.json(users)
})

app.get("/users/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(User).findOneBy({
         id : parseInt(req.params.id, 10),
    })
    return res.send(results)
})

app.post("/users", async function (req: Request, res: Response) {
    const user = await AppDataSource.getRepository(User).create(req.body)
    const results = await AppDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.put("/users/:id", async function (req: Request, res: Response) {
    const user = await AppDataSource.getRepository(User).findOneBy({
        id : parseInt(req.params.id, 10),
    })
    AppDataSource.getRepository(User).merge(user, req.body)
    const results = await AppDataSource.getRepository(User).save(user)
    return res.send(results)
})

app.delete("/users/:id", async function (req: Request, res: Response) {
    const results = await AppDataSource.getRepository(User).delete(req.params.id)
    return res.send(results)
})

// start express server
app.listen(3000)

   
    
}).catch(error => console.log(error))





