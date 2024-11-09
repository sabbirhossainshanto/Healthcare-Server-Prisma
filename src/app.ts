import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH Healthcare server is running",
  });
});

// module routes
app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
