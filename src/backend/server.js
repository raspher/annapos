import express from 'express';
import {sanitizer} from './shared/middleware.js';
import cookieParser from 'cookie-parser';
import {config} from './shared/config.js';
import apiRoutes from "./routes.js";

const app = express();

app.use(express.json());
app.use(sanitizer);
app.use(cookieParser());

app.use('/api', apiRoutes);

// Frontend
app.use("/", express.static("../frontend/dist/"));

app.listen(config.API_PORT, () => {
    console.log(`Server started on port http://localhost:${config.API_PORT}/`);
})