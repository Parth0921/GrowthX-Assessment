import { Router } from "express";
import { TUser } from "../types/user.types";
import User from "../mongodb/models/user";
import { generateAccessToken, generateHashPassword, matchPassword } from "./helper";
const router = Router();

router.post("/register", async (req, res) => {
    const newUser: TUser = req.body;
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
        res.status(400).send("Please provide all the details");
        return;
    } else if (newUser.role !== "user" && newUser.role !== "admin") {
        res.status(400).send("Invalid role");
        return;
    }

    // check if the user already exists
    try {
        const userExists = await User.findOne({ email: newUser.email});
        if (userExists) {
            res.status(400).send("User already exists");
            return;
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }

    // hash the password
    const hashPassword = await generateHashPassword(newUser.password);
    newUser.password = hashPassword;
    
    // create a new user
    const user = new User({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
    });
    try {
        await user.save();
        res.sendStatus(201);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

type TLogin = Omit<TUser, "name" | "role">;

router.post("/login", async (req, res) => {
    const reqUser:TLogin = req.body;
    if (!reqUser.email || !reqUser.password) {
        res.status(400).send("Please provide all the details");
        return;
    }

    let user;
    try {
        // check if the user exists
        user = await User.findOne({ email: reqUser.email});
        if (!user) {
            res.status(400).send("User does not exists");
            return;
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
    

    // check if the password is correct
    const isPasswordMatch = await matchPassword(reqUser.password, user.password);
    if (!isPasswordMatch) {
        res.status(400).send("Incorrect password");
        return;
    }

    const accessToken = generateAccessToken({
        email: user.email,
        role: user.role,
        id: user._id.toString(),
    })

    // set the access token in the cookie
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 5})
    res.status(200).send("Login successful");
})

router.post("/logout", (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        res.status(400).send("You are not logged in");
        return;
    }

    // clear the access token from the cookie
    res.clearCookie("accessToken");
    res.status(200).send("Logout successful");
})

export const authRouter = router;
