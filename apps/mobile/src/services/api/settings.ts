export interface AppSettings {
  musicVolume: number;
  sfxVolume: number;
  notificationsEnabled: boolean;
}

export interface SettingsRepository {
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: Partial<AppSettings>): Promise<void>;
}

export class MockSettingsRepository implements SettingsRepository {
  private settings: AppSettings = {
    musicVolume: 0.8,
    sfxVolume: 1.0,
    notificationsEnabled: true,
  };

  async getSettings() {
    return { ...this.settings };
  }

  async saveSettings(partial: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...partial };
  }
}

export const settingsRepository: SettingsRepository = new MockSettingsRepository();
