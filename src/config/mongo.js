// Solution for node version 24+, give it Google's DNS
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

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