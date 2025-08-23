import express from 'express';
import {sanitizer} from './shared/middleware.js';
import cookieParser from 'cookie-parser';
import {config} from './shared/config.js';
import apiRoutes from "./routes.js";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(sanitizer);
app.use(cookieParser());
if (config.PROFILE === "DEV")
    app.use(cors({ origin: true, credentials: true }));
else app.use(cors())

app.use('/api', apiRoutes);

// Frontend used only in production
app.use("/", express.static("./public/"));

app.listen(config.API_PORT, () => {
    console.log(`Server started on port http://localhost:${config.API_PORT}/`);
})