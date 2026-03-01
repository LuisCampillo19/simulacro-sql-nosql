import express from 'express';
import migrationRoutes from './modules/migration/migration.routes.js';



const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.json({ message: 'Welcome to API of SaludPlus'});
});

app.use('/api/migration', migrationRoutes);

export default app;