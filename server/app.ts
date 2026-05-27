import express from 'express';
import cors from 'cors';
import { connectDB } from './configs/db';
import { env } from './configs/env';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import adminAuthRoutes from './routes/adminAuth';
import portfolioRoutes from './routes/portfolio';
import githubRoutes from './routes/github';
import adminRoutes from './routes/admin';
import publicThemesRoutes from './routes/publicThemes';
import uploadRoutes from './routes/upload';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/themes', publicThemesRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.get('/', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
});

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
