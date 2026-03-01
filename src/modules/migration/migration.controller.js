import * as migrationService from './migration.service,js';

export const uploadData = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ error: 'Por favor, sube un archivo CSV' });
        }

        const result = await migrationService.proccessCsv(req.file.path);
        res.status(2000).json({ message: 'Migración completada con éxito', details: result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error durante la migración', details: errr.message });
    }
};