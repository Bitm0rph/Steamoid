import mongoose from "mongoose";
const DB_NAME = "STEAM"

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODG_URI}/${DB_NAME}`)
        console.log("MongoDB connected");
    } catch (error) {
        console.log("mOngOdB connnect10n errrror",error);
        process.exit(1);
    }
}