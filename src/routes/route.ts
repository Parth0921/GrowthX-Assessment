import { Router } from "express";
import { authRouter } from "../controllers/authentication";
import { verifyJWT } from "../middleware/verifyJWT";
import { userRouter } from "../controllers/user";
import { verifyUser } from "../middleware/verifyUser";
const router = Router();

router.use("/auth", authRouter);

// ensure middleware to check if user is authorized to access the route for every route below this line
router.use(verifyJWT);
router.use("/user",verifyUser, userRouter);

export const routes = router;
