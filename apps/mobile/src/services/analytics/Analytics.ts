export interface Analytics {
  trackScreen(name: string): void;
  trackEvent(name: string, props?: Record<string, unknown>): void;
  trackError(error: Error, context?: Record<string, unknown>): void;
}

class NoOpAnalytics implements Analytics {
  trackScreen(_name: string) {}
  trackEvent(_name: string, _props?: Record<string, unknown>) {}
  trackError(_error: Error, _context?: Record<string, unknown>) {}
}

export const analytics: Analytics = new NoOpAnalytics();
