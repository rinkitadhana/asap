import express, { type Request, type Response } from "express"

const app = express()
const port = 8080

app.get("/", (req: Request, res: Response) => {
  res.send("Hello China!")
})

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
