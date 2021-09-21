import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import mongodb from './src/helpers/db/mongodb';
import errorMiddleware from './src/middleware/errorMiddleware';
import userRouter from './src/routes/userRouter';

// parse env variables
dotenv.config();

mongodb();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use(errorMiddleware);

app.set('view engine', 'html');

// Static folder
app.use(express.static(`${__dirname}/views/`));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

export default app;
