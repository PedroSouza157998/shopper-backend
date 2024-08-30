import express, {Request, Response} from 'express';
import { errors } from 'celebrate';
import bodyParser from 'body-parser';
import cors from 'cors';

import 'reflect-metadata'
import 'dotenv/config'

import uploadRouter from './routes/upload.route'
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))

app.use('/upload', uploadRouter)

app.get('/', (req: Request, res: Response) => res.send('Server OK!'))

app.use(errors())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
