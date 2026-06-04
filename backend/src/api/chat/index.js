import express from "express";
import createRouter from "./create.js";
import getRouter from './get.js';
import getLastmessageRouter from './lastmessage.js';
const router = express.Router();

router.use("/create", createRouter);
router.use('/get', getRouter);
router.use('/lastmessage', getLastmessageRouter)


export default router;