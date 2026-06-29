import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().optional(),
  EXPO_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
});

function parseEnv() {
  const result = envSchema.safeParse({
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
  });

  if (!result.success) {
    console.warn(
      '[Dawn] Invalid environment configuration, using defaults',
      result.error.flatten(),
    );
    return envSchema.parse({});
  }

  return result.data;
}

export const env = parseEnv();
