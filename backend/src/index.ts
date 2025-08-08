import express, { type Request, type Response } from "express"
import { createServer } from "http"
import cors from "cors"
import { initSocket } from "./sockets/index.ts"
import qualityCheckRouter from "./routes/qualityCheck-router.ts"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.get("/", (req: Request, res: Response) => {
  res.send("bordre is live :D")
})
app.use("/api/quality-check", qualityCheckRouter)


const httpServer = createServer(app)

initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} :D`)
})