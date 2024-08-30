import express, { NextFunction, Request, Response } from 'express';
import { CelebrateError, errors, isCelebrateError } from 'celebrate';
import bodyParser from 'body-parser';
import cors from 'cors';

import 'reflect-metadata'
import 'dotenv/config'

import uploadRouter from './routes/upload.route'
import confirmRouter from './routes/confirm.route'
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/upload', uploadRouter)
app.use('/confirm', confirmRouter)

app.get('/', (req: Request, res: Response) => res.send('Server OK!'))

app.use((err: CelebrateError, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    let message = ''
    err.details.forEach((row) => !message && (message = row.message))
    return res.send({
      statusCode: 400,
      message
    });
  }

  return next(err);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
