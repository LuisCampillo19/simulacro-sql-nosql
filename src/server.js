import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './config/mongo.js';
import './config/mysql.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMongo();

        app.listen(PORT, () =>{
            console.log(`On server runnig in PORT ${PORT}`)
        });
    } catch (err) {
        console.error(' Fatal error to initial server: ',err);
        process.exit(1);
    }
};

startServer();