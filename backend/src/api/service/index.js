import express from "express";
import createServiceRouter from "./createservice.js";
import getUserServicesRouter from "./getUserServices.js"
import deleteServiceRouter from './deleteService.js'
import updateServiceRouter from './updateservice.js'
import getServicesRouter from './getServices.js';
import getServiceRouter from './getservice.js'

const router = express.Router();

router.use("/createservice", createServiceRouter);
router.use("/getuserservices", getUserServicesRouter);
router.use("/deleteservice", deleteServiceRouter);
router.use('/updateservice', updateServiceRouter)
router.use('/getserviceswithusers', getServicesRouter)
router.use('/updateservice', updateServiceRouter)
router.use('/getservice', getServiceRouter)
export default router;

