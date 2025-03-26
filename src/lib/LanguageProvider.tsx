
import React from 'react';
import { useLanguage } from './i18n';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // This is a simple wrapper that uses the zustand store
  // We could enhance this to provide additional context if needed
  return <>{children}</>;
};
