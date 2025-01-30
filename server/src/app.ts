import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import 'dotenv/config';
import bodyParser from "body-parser";
import { sendOpenAiChatMessage, transcribeAudio, textToSpeech, generateSummary } from './controllers/openAiController.js'
import { ServerError } from './types.js'
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only audio files are allowed'));
    }
  }
});

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.post("/api/v1/chat", sendOpenAiChatMessage, (req, res) => {
    // @ts-ignore
    const { responseMessage } = res.locals;

    res.status(200).json({
        responseMessage
    });
})

app.post("/api/v1/transcribe", upload.single('audio'), transcribeAudio);
app.post("/api/v1/text-to-speech", textToSpeech);
app.post("/api/v1/summary", generateSummary, (req, res) => {
    // @ts-ignore
    const { sessionSummary } = res.locals;

    console.log('summary api', res.locals)
    res.status(200).json({
        sessionSummary
    });
});

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
