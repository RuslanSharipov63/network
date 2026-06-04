import express from "express";
import getAuthAdminRouter from "./authadmin.js";


const router = express.Router();

router.use('/authadmin', getAuthAdminRouter);

export default router;

