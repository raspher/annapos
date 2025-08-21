import dotenv from 'dotenv';

dotenv.config({path: `../../.env`});

function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const config = {
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    API_PORT: getEnvVar("API_PORT"),
};