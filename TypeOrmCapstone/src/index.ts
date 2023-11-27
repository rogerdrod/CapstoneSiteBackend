
import { AppDataSource } from "./data-source";
import { Docs } from "./entity/Docs";
import { User } from "./entity/User";
import * as fs from 'fs';
import * as express from "express";
import * as multer from "multer";

const cors = require('cors');
const app = express(); // Create an instance of the express application
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can set up and run express / fastify / any other framework.");

    // Register routes
    app.get("/user/status/:email", async (req: express.Request, res: express.Response) => {
      try {
        const email = req.params.email;
        
        // Fetch the user from the database based on the email
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { email: email }
        });
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Respond with the user's status
        return res.status(200).json({ status: user.status });
      } catch (error) {
        console.error("Error fetching user status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/user/all", async function (req: express.Request, res: express.Response) {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.post("/user/status/update", async (req: express.Request, res: express.Response) => {
      try {
        const { userId, newStatus } = req.body;

        // Fetch the user from the database
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: userId }
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Check if the status is already up to date
        if (user.status !== newStatus) {
          user.status = newStatus;
          await userRepository.save(user);
          return res.status(200).json({ message: "User status updated successfully" });
        } else {
          return res.status(200).json({ message: "User status is already up to date" });
        }
      } catch (error) {
        console.error("Error saving updated user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
    


    app.post("/users/login", async function (req: express.Request, res: express.Response) {
        try {
          const { email, password } = req.body;
      
          // Implement authentication logic here
          // For example, check if the email and password match a user in the database
          // You might want to use a library like bcrypt to securely compare passwords
          // Replace the following code with your actual authentication logic
      
          const user = await AppDataSource.getRepository(User).findOne({
            where: { email: email, password: password },
          });
      
          if (user) {
            // Authentication successful
            return res.status(200).json({ message: "Login successful", user: user });
          } else {
            // Authentication failed
            return res.status(401).json({ message: "Invalid credentials" });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error");
        }
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

    app.get("/user/:id", async function (req, res) {
      try {
        const id = parseInt(req.params.id, 10); // Convert id to number
        const user = await AppDataSource.getRepository(User).findOne({
          where: { id: id },
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

    app.post("/users",async function (req: express.Request, res: express.Response) {
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

      app.get("/docs/:fileName", async function (req: express.Request, res: express.Response) {
        try {
          const fileName = req.params.fileName;
          const doc = await AppDataSource.getRepository(Docs).findOne({
            where: { name: fileName },
          });
      
          if (doc) {
            const filePath = doc.file_path;
            return res.json({ filePath, fileName });
          } else {
            return res.status(404).send("Document not found");
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        }
      });


/*
// Remove the .single('file') part
const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    // Set the destination folder for file uploads
    callback(null, 'C:/Users/denri/CapstoneSiteBackend/TypeOrmCapstone/src/files/');
  },
  filename: (req, file, callback) => {
    // Set the filename for the uploaded file
    callback(null, file.originalname);
  }
});
*/
const storage: multer.StorageEngine = multer.memoryStorage();

    const upload = multer({ storage: storage });

    // Update the "/docs/upload" route
    app.post("/docs/upload", upload.single('file'), async (req: express.Request, res: express.Response) => {
      try {
        console.log('Received file:', req.file);

        if (!req.file) {
          console.error('No file provided');
          return res.status(400).json({ error: 'No file provided' });
        }
        const userRepository = AppDataSource.getRepository(User);
        console.log('UserId:', req.body.userId);

        const userId = parseInt(req.body.userId, 10);
        console.log('UserId:', req.body.userId);

        const fileName = req.file.originalname;
        const filePath = 'C:/Users/Roger/CapstoneSiteBackend/TypeOrmCapstone/src/files/' + fileName;

        console.log('Processing file:', fileName);

        // Save the file content to the specified file path
        fs.writeFileSync(filePath, req.file.buffer);

        console.log('File saved to disk.');

        // Insert into the MySQL database using TypeORM
        const docRepository = AppDataSource.getRepository(Docs);
        const user = await userRepository.findOne({
          where: { id: userId }
        });

        const newDoc = docRepository.create({
          name: fileName,
          file_path: filePath,
          user: user,
        });

        console.log('Saving document to the database.');

        await docRepository.save(newDoc);

        console.log('Document saved successfully.');

        res.status(200).json({ message: 'File uploaded and data inserted into the database successfully.' });
      } catch (error) {
        console.error('Error handling file upload and database insertion:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    });




    // Start express server
    const PORT = process.env.PORT || 3000;
    console.log(`Listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch(error => console.log(error));


