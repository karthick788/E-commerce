'use client';

import { ThemeProvider } from './theme-provider';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
