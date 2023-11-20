
import { AppDataSource } from "./data-source";
import { Docs } from "./entity/Docs";
import { User } from "./entity/User";
import * as fs from 'fs';
import * as express from "express";

const cors = require('cors');
const app = express(); // Create an instance of the express application

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can set up and run express / fastify / any other framework.");

    // Register routes

    app.get("/user/all", async function (req: express.Request, res: express.Response) {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.get("/users/:email", async function (req: express.Request, res: express.Response) {
      try {
        const email = req.params.email;
        const user = await AppDataSource.getRepository(User).findOne({
          where: { email: email },
        });

        if (!user) {
          return res.status(404).send("User not found");
        }

        return res.send(user);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
    }); 

    app.post("/users", async function (req: express.Request, res: express.Response) {
      const user = await AppDataSource.getRepository(User).create(req.body);
      const results = await AppDataSource.getRepository(User).save(user);
      return res.send(results);
    });
/*
    app.put("/users/:id", async function (req: express.Request, res: express.Response) {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: parseInt(req.params.id, 10),
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      AppDataSource.getRepository(User).merge(user, req.body);
      const results = await AppDataSource.getRepository(User).save(user);
      return res.send(results);
    }); */

    /*
    app.delete("/users/:id", async function (req: express.Request, res: express.Response) {
      const results = await AppDataSource.getRepository(User).delete(req.params.id);
      return res.send(results);
    }); */

    app.get("/docs/all", async function (req: express.Request, res: express.Response) {
        try {
          const docs = await AppDataSource.getRepository(Docs).find();
          return res.json(docs);
        } catch (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error");
        }
      });

    // Start express server
    const PORT = process.env.PORT || 3000;
    console.log(`Listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch(error => console.log(error));


