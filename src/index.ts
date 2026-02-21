import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';
import securityMiddleware from './middleware/security';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app = express();
const PORT = 8000;

if (!process.env.FRONTEND_URL) {
  console.warn('FRONTEND_URL is not set — CORS will be restrictive by default');
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);

app.use('/api/subjects', subjectsRouter);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
