import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongodb from './src/helpers/db/mongodb';
import errorMiddleware from './src/middleware/errorMiddleware';
import userRouter from './src/routes/userRouter';
import deviceRouter from './src/routes/deviceRouter';
import authRoater from './src/routes/authRoater';

// parse env variables
dotenv.config();

mongodb();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRouter);
app.use('/device', deviceRouter);
app.use('/auth', authRoater);
app.use(errorMiddleware);

app.set('view engine', 'html');

// Static folder
app.use(express.static(`${__dirname}/views/`));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

export default app;
