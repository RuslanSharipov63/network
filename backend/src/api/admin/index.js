import express from "express";
import getAuthAdminRouter from "./authadmin.js";
import getServicesRouter from "./getServices.js";
import getServiceRouter from "./getService.js";
import changeStatusRouter from './changeStatus.js'

const router = express.Router();

router.use('/authadmin', getAuthAdminRouter);
router.use('/getservices', getServicesRouter);
router.use('/getservice', getServiceRouter)
router.use('/changestatus', changeStatusRouter)

export default router;

