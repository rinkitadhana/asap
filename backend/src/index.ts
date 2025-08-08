import express, { type Request, type Response } from "express"
import { createServer } from "http"
import { initSocket } from "./sockets/index.ts"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("bordre is live :D")
})

const httpServer = createServer(app)

initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} :D`);
})