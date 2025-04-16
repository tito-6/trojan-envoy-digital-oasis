import React from 'react';

export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
  >
    Skip to main content
  </a>
);

type VisuallyHiddenProps = {
  children: React.ReactNode;
};

export const VisuallyHidden = ({ children }: VisuallyHiddenProps) => (
  <span className="sr-only">{children}</span>
);

export const FocusRing = ({ children }: { children: React.ReactNode }) => (
  <div className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:outline-none rounded">
    {children}
  </div>
);

export const useKeyboardNavigation = () => {
  React.useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);
};

export const KeyboardFocusProvider = ({ children }: { children: React.ReactNode }) => {
  useKeyboardNavigation();
  return <>{children}</>;
};