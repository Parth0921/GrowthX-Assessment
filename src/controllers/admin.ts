import { Router } from "express";
import { CustomAdminRequest } from "../middleware/verifyAdmin";
import Assignment from "../mongodb/models/assignment";
import { convertIdStringToObjectId } from "./helper";

const router = Router();


router.get("/assignments", async (req: CustomAdminRequest, res) => {
    const adminId = req.admin?._id;
    if (!adminId) {
        res.status(401).send("Unauthorized");
        return;
    }

    // get all assignments for this admin
    const assignments = await Assignment.find({ admin: adminId }).populate("createdBy", "name");
    if (!assignments || assignments.length === 0) {
        res.status(404).send("No assignments found");
        return;
    }

    const assignmentsToSend = assignments.map((assignment) => {
        return {
            task: assignment.task,
            status: assignment.status,
            createdBy: assignment.createdBy,
            createdAt: assignment.createdAt,
        }
    })
    
    res.status(200).send(assignmentsToSend);
})

router.post("/assignments/:id/accept", async (req: CustomAdminRequest, res) => {
    const adminId = req.admin?._id;
    if (!adminId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const assignmentId = req.params.id;
    const assignment = await Assignment.findOne({ _id: assignmentId, admin: adminId });
    if (!assignment) {
        res.status(404).send("Assignment not found");
        return;
    }

    assignment.status = "Accepted";
    await assignment.save();
    res.status(200).send("Assignment accepted");
})

router.post("/assignments/:id/reject", async (req: CustomAdminRequest, res) => {
    const adminId = req.admin?._id;
    if (!adminId) {
        res.status(401).send("Unauthorized");
        return;
    }

    const assignmentId = req.params.id;
    const assignment = await Assignment.findOne({ _id: convertIdStringToObjectId(assignmentId), admin: adminId });
    if (!assignment) {
        res.status(404).send("Assignment not found");
        return;
    }

    assignment.status = "Rejected";
    await assignment.save();
    res.status(200).send("Assignment Rejected");
})
export const adminRouter = router;
