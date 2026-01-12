import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import noteRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(authRoutes);

app.use(noteRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
