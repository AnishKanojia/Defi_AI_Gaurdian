import { db } from '../firebase.ts';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserSettings, defaultUserSettings } from '../types/UserSettings.ts';

const SETTINGS_COLLECTION = 'user_settings';

export const getUserSettings = async (uid: string): Promise<UserSettings> => {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, uid);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      await setDoc(ref, defaultUserSettings);
      return defaultUserSettings;
    }
    const data = snapshot.data() as Partial<UserSettings>;
    return {
      darkMode: data.darkMode ?? defaultUserSettings.darkMode,
      theme: data.theme ?? defaultUserSettings.theme,
      language: data.language ?? defaultUserSettings.language,
      currency: (data.currency as any) ?? defaultUserSettings.currency,
      notifications: {
        email: data.notifications?.email ?? defaultUserSettings.notifications.email,
        push: data.notifications?.push ?? defaultUserSettings.notifications.push,
        sms: data.notifications?.sms ?? defaultUserSettings.notifications.sms,
      },
      privacy: {
        profileVisible: data.privacy?.profileVisible ?? defaultUserSettings.privacy.profileVisible,
      },
      twoFactorEnabled: data.twoFactorEnabled ?? defaultUserSettings.twoFactorEnabled,
    };
  } catch (_) {
    // Fallback gracefully when offline or on error
    return defaultUserSettings;
  }
};

export const setUserSettings = async (uid: string, settings: UserSettings): Promise<void> => {
  const ref = doc(db, SETTINGS_COLLECTION, uid);
  await setDoc(ref, settings, { merge: true });
};

export const updateUserSettings = async (uid: string, partial: Partial<UserSettings>): Promise<void> => {
  const ref = doc(db, SETTINGS_COLLECTION, uid);
  await updateDoc(ref, partial as any);
};


