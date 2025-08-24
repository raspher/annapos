import "reflect-metadata"
import express from 'express';
import { sanitizer } from './routes/middleware.js';
import cookieParser from 'cookie-parser';
import config from './shared/config.js';
import apiRoutes from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(sanitizer);
app.use(cookieParser());
if (config.PROFILE === 'DEV') app.use(cors({ origin: true, credentials: true }));
else app.use(cors());

app.use('/api', apiRoutes);

// Frontend used only in production
app.use('/', express.static('./public/'));

app.listen(Number(config.API_PORT), () => {
  console.log(`Server started on port http://localhost:${config.API_PORT}/`);
});
