import mongoose from "mongoose";
import 'dotenv/config';

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect MongoDB');
    } catch (err) {
        console.error('Connecting error: ', err.message);
    }
};