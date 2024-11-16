import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
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
    },
}, { timestamps: true })

export type AdminDocument = mongoose.InferSchemaType<typeof adminSchema> & {
    _id: mongoose.Types.ObjectId 
};


const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
