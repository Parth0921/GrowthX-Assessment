import express from "express";
import { connectMongoDB } from "./mongodb/config";
import dotenv from "dotenv";
import { routes } from "./routes/route";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

//dotenv config
dotenv.config();

const PORT = 3000;

// connect to MongoDB
connectMongoDB();

app.use("/", routes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
