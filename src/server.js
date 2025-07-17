import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import coinRouter from './api/routers/coins.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan('dev'));


// routes
app.use('/api', coinRouter)


// handle global error
app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.setHeader('Content-Type', 'application/json');

    res.status(status).json({
        status: 'Error',
        message
    });
});


export default app;
