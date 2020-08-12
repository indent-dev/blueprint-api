import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import errorHandler from './middlewares/errorHandler'
import projectRouter from './api/project/project.router'
import userRouter from './api/user/user.router'

const app = express()

app.use(helmet())

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({
    isSucces: true,
    message: 'Hello, World!',
  })
})

app.use(userRouter)
app.use(projectRouter)
app.use(errorHandler)

export default app
