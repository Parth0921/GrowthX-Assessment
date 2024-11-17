import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateHashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const matchPassword = async (password: string, hashPassword: string) => {
    return bcrypt.compare(password, hashPassword);
}

export const generateAccessToken = (payload:Record<string, any>) => {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '5m'});
    return token;
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

interface Token  {
    email: string;
    id: string;
    role: "user" | "admin";
    iat: number;
    exp: number;
}

export const decodeAccessToken = (token: string) => {
    const decodedToken = jwt.decode(token);
    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken) || !('id' in decodedToken) || !('role' in decodedToken)) {
        return null;
    }
    return decodedToken as Token;
}

export const convertIdStringToObjectId = (id: string) => {
    return new mongoose.Types.ObjectId(id);
}
