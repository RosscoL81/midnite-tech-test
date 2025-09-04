import express, { Request, Response, Router } from "express";
import { UserMonitoringService } from "../services/userMonitoring.service";

export const userMonitoringRouter: Router = express.Router();
const userMonitoringService = new UserMonitoringService();

userMonitoringRouter.post('/event', (req: Request, res: Response) => {
  const userDetails = req.body;
  const result = userMonitoringService.getAlert(userDetails);
  return res.status(200).json(result);
})