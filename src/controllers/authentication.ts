import { Router } from "express";
import { TUser } from "../types/user.types";
import User from "../mongodb/models/user";
import { generateAccessToken, generateHashPassword, matchPassword } from "./helper";
import Admin from "../mongodb/models/admin";
const router = Router();

router.post("/user/register", async (req, res) => {
    const newUser: TUser = req.body;
    console.log(newUser);
    if (!newUser.name || !newUser.email || !newUser.password) {
        res.status(400).send("Please provide all the details");
        return;
    }
    // check if the user already exists
    const userExists = await User.findOne({ email: newUser.email});
    if (userExists) {
        res.status(400).send("User already exists");
        return;
    }

    // hash the password
    const hashPassword = await generateHashPassword(newUser.password);
    newUser.password = hashPassword;
    
    // create a new user
    await User.create(newUser);
    res.sendStatus(201);
})

router.post("/user/login", async (req, res) => {
    const reqUser:TUser = req.body;
    if (!reqUser.email || !reqUser.password) {
        res.status(400).send("Please provide all the details");
        return;
    }

    // check if the user exists
    const user = await User.findOne({ email: reqUser.email});
    if (!user) {
        res.status(400).send("User does not exists");
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
        id: user._id.toString(),
    })

    // set the access token in the cookie
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 5})

    res.status(200).send("Login successful");
})

router.post("/admin/register", async (req, res) => {
   const newAdmin: TUser = req.body;
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        res.status(400).send("Please provide all the details");
        return;
    }
    // check if the user already exists
    const adminExists = await Admin.findOne({ email: newAdmin.email});
    if (adminExists) {
        res.status(400).send("Admin already exists");
        return;
    }

    // hash the password
    const hashPassword = await generateHashPassword(newAdmin.password);
    newAdmin.password = hashPassword;
    
    // create a new user
    await Admin.create(newAdmin);
    res.sendStatus(201); 
})

router.post("/admin/login", async (req, res) => {
    const adminReq:TUser = req.body;
    if (!adminReq.email || !adminReq.password) {
        res.status(400).send("Please provide all the details");
        return;
    }

    // check if the user exists
    const admin = await Admin.findOne({ email: adminReq.email});
    if (!admin) {
        res.status(400).send("User does not exists");
        return;
    }

    // check if the password is correct
    const isPasswordMatch = await matchPassword(adminReq.password, admin.password);
    if (!isPasswordMatch) {
        res.status(400).send("Incorrect password");
        return;
    }

    const accessToken = generateAccessToken({
        email: admin.email,
        id: admin._id.toString(),
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
