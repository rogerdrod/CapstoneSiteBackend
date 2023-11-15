import { AppDataSource } from "./data-source"
import { Docs } from "./entity/Docs"
import { User } from "./entity/User"
import * as bodyParser from "body-parser"
import * as fs from 'fs'
import * as express from "express"
import { Request, Response } from "express"

AppDataSource.initialize().then(async () => {

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

    /*
    console.log("Inserting a new user into the database...")
    const user = new User() 
    user.firstName = "Apple" 
    user.lastName = "Pie" 
    user.password = "numbers" 
    user.email = "apple@gmail.com" 
    user.userType = 2 
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
    */

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")
    
}).catch(error => console.log(error))
