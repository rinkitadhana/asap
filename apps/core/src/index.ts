import express, { type Request, type Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { initSocket } from "./sockets/index.ts";
import authRouter from "./routes/auth.route.ts";

const app = express();
const PORT = 4000;


app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Asap is live :D");
});
app.use("/api/auth", authRouter);

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} :D`);
});
