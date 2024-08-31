import express, { NextFunction, Request, Response } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import 'reflect-metadata'
import 'dotenv/config'

import uploadRouter from './routes/upload.route'
import confirmRouter from './routes/confirm.route'
import listRouter from './routes/list.route'


listRouter
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/', uploadRouter)
app.use('/', confirmRouter)
app.use('/', listRouter)

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
