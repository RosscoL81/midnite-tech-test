import express from "express";
import { userMonitoringRouter } from "./routes/userMonitoring.route"

const app = express();

app.use(express.json())
app.use('/', userMonitoringRouter);
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000')
})

export default app;