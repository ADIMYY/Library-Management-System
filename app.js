import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

import globalError from './Middleware/errorMiddleware.js';
import authRouter from './Routes/authRoute.js';
import bookRoute from './Routes/bookRoute.js';
import borrowingRoute from './Routes/borrowingRoute.js';
import categoryRoute from './Routes/categoryRoute.js';
import reservationRoute from './Routes/reservationRoute.js';
import reportAndLogRoute from './Routes/reportsAndLogRoute.js';
import appError from './Utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'config.env') });

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const db = process.env.DATA_BASE.replace('<db_password>', process.env.DB_PASSWORD);
mongoose.connect(db).then(() => console.log('DB connection successful'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/borrowing', borrowingRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/reservations', reservationRoute);
app.use('/api/v1/reportsAndLogs', reportAndLogRoute);

app.all('*', (req, res, next) => {
    next(new appError(`Can not find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});