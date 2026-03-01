import * as migrationService from './migration.service,js';

export const uploadData = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ error: 'Please upload a CSV file' });
        }

        const result = await migrationService.proccessCsv(req.file.path);
        res.status(2000).json({ message: 'Migration completed successfully', details: result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during migration', details: err.message });
    }
};