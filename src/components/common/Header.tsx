
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { storageService } from "@/lib/storage";
import { HeaderSettings, NavigationItem } from "@/lib/types";

interface HeaderProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export function Header({ isDarkTheme, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>({
    id: 1,
    siteTitle: "Trojan Envoy",
    logoPath: "/logo.svg",
    contactButtonText: "Contact Us",
    contactButtonPath: "/contact",
    showLanguageSelector: true,
    showThemeToggle: true,
    enabledLanguages: ["en"],
    defaultLanguage: "en",
    mobileMenuLabel: "Menu",
    lastUpdated: new Date().toISOString(),
  });
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    // Load header settings from storage
    const settings = storageService.getHeaderSettings();
    setHeaderSettings(settings);

    // Subscribe to settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setHeaderSettings(event.detail);
      }
    };

    window.addEventListener('header-settings-updated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('header-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    // Load navigation items from storage
    const items = storageService.getAllNavigationItems();
    setNavigationItems(items);

    // Subscribe to navigation updates
    const handleNavigationUpdate = () => {
      const updatedItems = storageService.getAllNavigationItems();
      setNavigationItems(updatedItems);
    };

    window.addEventListener('navigation-updated', handleNavigationUpdate);

    return () => {
      window.removeEventListener('navigation-updated', handleNavigationUpdate);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          {headerSettings.logoPath ? (
            <img src={headerSettings.logoPath} alt={headerSettings.siteTitle} className="h-8" />
          ) : (
            headerSettings.siteTitle
          )}
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.sort((a, b) => a.order - b.order).map((item) => (
            <Link key={item.id} to={item.path} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
          <Link to={headerSettings.contactButtonPath}>
            <Button>{headerSettings.contactButtonText}</Button>
          </Link>
          {headerSettings.showLanguageSelector && <LanguageSelector />}
          {headerSettings.showThemeToggle && <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-5 w-5" aria-label="Close menu" />
          ) : (
            <Menu className="h-5 w-5" aria-label="Open menu" />
          )}
          <span className="sr-only">{headerSettings.mobileMenuLabel}</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-background border-b md:hidden">
          <div className="container py-4 flex flex-col space-y-3">
            {navigationItems.sort((a, b) => a.order - b.order).map((item) => (
              <Link key={item.id} to={item.path} className="hover:text-primary transition-colors block">
                {item.label}
              </Link>
            ))}
            <Link to={headerSettings.contactButtonPath} className="block">
              <Button>{headerSettings.contactButtonText}</Button>
            </Link>
            {headerSettings.showLanguageSelector && <LanguageSelector />}
            {headerSettings.showThemeToggle && <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />}
          </div>
        </div>
      )}
    </header>
  );
}
