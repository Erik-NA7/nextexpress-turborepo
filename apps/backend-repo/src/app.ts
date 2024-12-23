import express, { json, urlencoded } from "express";
import { https } from "firebase-functions";
import cors from "cors";
import authMiddleWare from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";


const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(authMiddleWare);
app.use('/users', authMiddleWare, userRouter);

export const api =  https.onRequest(app);
