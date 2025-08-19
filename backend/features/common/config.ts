const requiredEnv = ["DATABASE_URL", "JWT_SECRET"] as const;

type RequiredEnv = typeof requiredEnv[number];

function getEnvVar(name: RequiredEnv): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const config = {
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
};