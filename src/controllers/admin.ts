import { Router } from "express";
import { CustomUserRequest } from "../middleware/verifyUser";
import Assignment from "../mongodb/models/assignment";
import { convertIdStringToObjectId } from "./helper";

const router = Router();

router.get("/assignments", async (req: CustomUserRequest, res) => {
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        const assignments = await Assignment.find({admin: req.user._id}).populate("createdBy", "name email");
        if (!assignments) {
            res.status(200).send("No assignments found");
            return;
        }
        const assignmentInformation = assignments.map((assignment) => {
            return {
                taskId: assignment._id.toString(),
                task: assignment.task,
                createdBy: assignment.createdBy,
                status: assignment.status
            }
        })
        res.status(200).send(assignmentInformation);
    } catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
})

router.post("/assignments/:id/accept", async (req: CustomUserRequest, res) => {
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    const assignmentId = req.params.id;
    if (!assignmentId) {
        res.status(400).send("Invalid input");
        return;
    }
    try {
        const assignment = await Assignment.findOne({_id: convertIdStringToObjectId(assignmentId), admin: req.user._id});
        if (!assignment) {
            res.status(400).send("Assignment id not found");
            return;
        }
        assignment.status = "Accepted";
        await assignment.save();
        res.status(200).send("Assignment Accepted");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/assignments/:id/reject", async (req: CustomUserRequest, res) => {
    if (!req.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    const assignmentId = req.params.id;
    if (!assignmentId) {
        res.status(400).send("Invalid input");
        return;
    }
    try {
        const assignment = await Assignment.findOne({_id: convertIdStringToObjectId(assignmentId), admin: req.user._id});
        if (!assignment) {
            res.status(400).send("Assignment id not found");
            return;
        }
        assignment.status = "Rejected";
        await assignment.save();
        res.status(200).send("Assignment Rejected");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

export const adminRouter = router;
