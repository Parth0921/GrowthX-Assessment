import { Router } from "express";
import { TAssignment } from "../types/assignment.types";
import Assignment from "../mongodb/models/assignment";
import { CustomUserRequest } from "../middleware/verifyUser";
import User from "../mongodb/models/user";

const router = Router();

router.post("/upload", async (req:CustomUserRequest, res) => {
    const assignment:TAssignment = req.body;
    if (!assignment.task || !assignment.admin) {
        res.status(400).send("Invalid input");
        return;
    }
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        // check if admin exists or not
        const admin = await User.findOne({email: assignment.admin, role: "admin"});
        if (!admin) {
            res.status(400).send("Admin does not exist");
            return;
        }

        const assignmentObj = new Assignment({
            task: assignment.task,
            admin: admin._id,
            createdBy: req.user._id
        })
        await assignmentObj.save();
        res.status(201).send("Assignment uploaded successfully");
    } catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
})

router.get("/admins/all", async (req, res) => {
    try { 
        const admins = await User.find({role: "admin"});
        const adminInformation = admins.map((admin) => {
            return {
                name: admin.name,
                email: admin.email
            }
        })
        res.status(200).send(adminInformation);

    } catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
})

export const userRouter = router;
