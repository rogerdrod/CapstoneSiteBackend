import { getRepository } from "typeorm"
import { User } from "./entity/User";

export const Bootstrap = async () => {
    const userRepo = getRepository(User);
    const user = userRepo.create({ firstName: "Daniel", lastName: "Diaz", password: "poop", email: "daniel@gmail.com", userType: 2, status: null});
    await userRepo.save(user).catch((err) => {
        console.log("Error: ", err);
    });
    console.log("New User Saved: ", user);
}