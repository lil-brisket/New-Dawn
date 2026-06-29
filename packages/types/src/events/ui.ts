export interface ToastRequestedEvent {
  type: 'toast_requested';
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
}

export interface ScreenShakeEvent {
  type: 'screen_shake';
  intensity: number;
  durationMs: number;
}

export type UIEvent = ToastRequestedEvent | ScreenShakeEvent;

export type UIEventType = UIEvent['type'];
