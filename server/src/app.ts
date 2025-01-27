import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import 'dotenv/config';
import bodyParser from "body-parser";
import { openAiController } from './controllers/openAiController.ts'
import { ServerError } from './types.ts'

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.post("/api/v1/chat", openAiController, (req, res) => {
    // @ts-ignore
    const { responseMessage } = res.locals;

    res.status(200).json({
        responseMessage
    });
})

const errorHandler: ErrorRequestHandler = (
    err: ServerError,
    _req,
    res,
    _next
  ) => {
    const defaultErr: ServerError = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj: ServerError = { ...defaultErr, ...err };
    console.log(errorObj.log);
    res.status(errorObj.status).json(errorObj.message);
  };
  
  app.use(errorHandler);

export default app;
