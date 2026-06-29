const isProduction = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production';

export const Logger = {
  debug(message: string, ...args: unknown[]) {
    if (!isProduction) {
      console.debug(`[Dawn] ${message}`, ...args);
    }
  },
  info(message: string, ...args: unknown[]) {
    console.info(`[Dawn] ${message}`, ...args);
  },
  warn(message: string, ...args: unknown[]) {
    console.warn(`[Dawn] ${message}`, ...args);
  },
  error(message: string, ...args: unknown[]) {
    console.error(`[Dawn] ${message}`, ...args);
  },
};
