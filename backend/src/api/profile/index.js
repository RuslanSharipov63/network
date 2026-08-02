import express from 'express';
import updateRouter from './update.js';

const router = express.Router();

router.use('/update', updateRouter)

export default router;