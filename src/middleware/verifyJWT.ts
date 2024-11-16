import { Request, Response, NextFunction} from 'express';
import { verifyAccessToken } from '../controllers/helper';


export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(403).send("Unauthorized Request");
        return;
    }

    // Verify the token
    const isVerified = verifyAccessToken(token);
    if (!isVerified) {
        res.clearCookie('accessToken');
        res.status(403).send("Unauthorized Request");
        return;
    }
    next();
}
