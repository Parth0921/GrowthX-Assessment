import { Request, Response, NextFunction } from 'express';
import { convertIdStringToObjectId, decodeAccessToken } from '../controllers/helper';
import Admin, { AdminDocument } from '../mongodb/models/admin';
// if flow reaches here we are sure that request is authorized
// Need to make sure that the request is from an admin

export interface CustomAdminRequest extends Request {
    admin?: AdminDocument; // change this to admin
}

export const verifyAdmin = async (req: CustomAdminRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const decodedToken = decodeAccessToken(accessToken);
    if (!decodedToken) {
        res.status(401).send("Unauthorized");
        return;
    }
    const admin = await Admin.findOne({ _id: convertIdStringToObjectId(decodedToken.id) });
    if (!admin) {
        res.status(401).send("Request valid only for admin");
        return;
    }
    req.admin = admin;
    next();
}
