import mongoose from "mongoose";
import { exit } from "process";

export const connectMongoDB = async () => {
    console.log(process.env.MONGODB_URL);

    try {
        await mongoose.connect(process.env.MONGODB_URL as string)
        console.log("Connected to db");
    }
    catch (e) {
        console.log("Error connecting to db: ", e);
        exit(1);
    }
}
