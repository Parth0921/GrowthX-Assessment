import { Request, Response, NextFunction } from 'express';
import { convertIdStringToObjectId, decodeAccessToken } from '../controllers/helper';
import User, { UserDocument } from '../mongodb/models/user';
// if flow reaches here we are sure that request is authorized
// Need to make sure that the request is from a user

export interface CustomUserRequest extends Request {
    user?: UserDocument; 
}

export const verifyUser = async (req: CustomUserRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const decodedToken = decodeAccessToken(accessToken);
    if (!decodedToken) {
        res.status(401).send("Unauthorized");
        return;
    }
    const user = await User.findOne({ _id: convertIdStringToObjectId(decodedToken.id) });
    if (!user) {
        res.status(401).send("Request valid only for user");
        return;
    }
    req.user = user;
    next();
}
