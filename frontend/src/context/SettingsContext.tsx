import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { UserSettings, defaultUserSettings } from '../types/UserSettings.ts';
import { getUserSettings, setUserSettings, updateUserSettings } from '../services/settings.ts';
import { useAuth } from './AuthContext.tsx';

interface SettingsContextValue {
  settings: UserSettings;
  loading: boolean;
  save: (settings: UserSettings) => Promise<void>;
  update: (partial: Partial<UserSettings>) => Promise<void>;
}

const defaultValue: SettingsContextValue = {
  settings: defaultUserSettings,
  loading: true,
  save: async () => undefined,
  update: async () => undefined,
};

const SettingsContext = createContext<SettingsContextValue>(defaultValue);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettingsState] = useState<UserSettings>(defaultUserSettings);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      setLoading(true);
      try {
        if (currentUser?.uid) {
          const loaded = await getUserSettings(currentUser.uid);
          if (active) setSettingsState(loaded);
        } else {
          if (active) setSettingsState(defaultUserSettings);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => { active = false; };
  }, [currentUser?.uid]);

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    loading,
    async save(newSettings: UserSettings) {
      setSettingsState(newSettings);
      if (currentUser?.uid) {
        await setUserSettings(currentUser.uid, newSettings);
      }
    },
    async update(partial: Partial<UserSettings>) {
      const merged = { ...settings, ...partial } as UserSettings;
      setSettingsState(merged);
      if (currentUser?.uid) {
        await updateUserSettings(currentUser.uid, partial);
      }
    },
  }), [settings, loading, currentUser?.uid]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};


