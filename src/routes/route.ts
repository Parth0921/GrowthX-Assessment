import { Router } from "express";
import { authRouter } from "../controllers/authentication";
import { verifyJWT } from "../middleware/verifyJWT";
import { userRouter } from "../controllers/user";
import { verifyAdmin, verifyUser } from "../middleware/verifyUser";
import { adminRouter } from "../controllers/admin";
const router = Router();

router.use("/auth", authRouter);

// ensure middleware to check if user is authorized to access the route for every route below this line
router.use(verifyJWT);
router.use("/user",verifyUser, userRouter);
router.use("/admin", verifyAdmin, adminRouter);

export const routes = router;
