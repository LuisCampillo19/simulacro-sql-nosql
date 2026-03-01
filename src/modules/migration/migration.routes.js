import { Router } from 'express';
import multer from 'multer';
import * as migrationController from './migration.controller.js';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), migrationController.uploadData);

export default router;