export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PrivacyPreferences {
  profileVisible: boolean;
}

export interface UserSettings {
  darkMode: boolean; // legacy
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: 'USD' | 'EUR' | 'BTC' | 'INR';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  twoFactorEnabled: boolean;
}

export const defaultUserSettings: UserSettings = {
  darkMode: false,
  theme: 'system',
  language: 'English',
  currency: 'USD',
  notifications: { email: true, push: false, sms: false },
  privacy: { profileVisible: true },
  twoFactorEnabled: false,
};


