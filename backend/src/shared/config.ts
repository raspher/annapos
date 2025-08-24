function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  API_PORT: getEnvVar('API_PORT'),
  PROFILE: getEnvVar('PROFILE'),
  POSTGRES_USER: getEnvVar('POSTGRES_USER'),
  POSTGRES_PASSWORD: getEnvVar('POSTGRES_PASSWORD'),
  POSTGRES_DB: getEnvVar('POSTGRES_DB'),
  POSTGRES_PORT: getEnvVar('POSTGRES_PORT'),
    POSTGRES_HOST: getEnvVar('POSTGRES_HOST'),
} as const;

export type AppConfig = typeof config;

export default config;
