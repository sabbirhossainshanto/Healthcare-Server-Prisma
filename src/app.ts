import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.route";
import { adminRoutes } from "./app/modules/Admin/admin.route";

const app: Application = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// module routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admins", adminRoutes);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH Healthcare server is running",
  });
});

export default app;
