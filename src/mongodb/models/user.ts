import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> & {
    _id: mongoose.Types.ObjectId 
};

const User = mongoose.model("User", userSchema);
export default User;
