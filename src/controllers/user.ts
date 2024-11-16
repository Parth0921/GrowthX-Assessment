import { Router } from "express";
import { TAssignment } from "../types/assignment.types";
import Assignment from "../mongodb/models/assignment";
import Admin from "../mongodb/models/admin";
import { CustomUserRequest } from "../middleware/verifyUser";

const router = Router();

router.post("/upload", async (req:CustomUserRequest, res) => {
    const assignment:TAssignment = req.body;
    if (!assignment.task || !assignment.admin) {
        res.status(400).send("Invalid input");
        return;
    }

    try {
        // check if admin exists or not
        const admin = await Admin.findOne({name: assignment.admin});
        if (!admin) {
            res.status(400).send("Admin does not exist");
            return;
        }

        const assignmentObj = new Assignment({
            task: assignment.task,
            admin: admin._id,
            createdBy: req.user?._id
        })
        await assignmentObj.save();
    } catch (error) {
        res.status(500).send("Internal server error");
        return;
    }

    res.status(201).send("Assignment uploaded successfully");
})

router.get("/admins/all", async (req, res) => {
    try { 
        const admins = await Admin.find();
        const adminNames = admins.map(admin => admin.name);
        res.status(200).send(adminNames);

    } catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
})

export const userRouter = router;
