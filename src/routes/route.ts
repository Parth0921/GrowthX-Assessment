import { Router } from "express";
import { authRouter } from "../controllers/authentication";
import { verifyJWT } from "../middleware/verifyJWT";
const router = Router();

router.use("/auth", authRouter);

// ensure middleware to check if user is authorized to access the route for every route below this line
router.use(verifyJWT);


export const routes = router;
