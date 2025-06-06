import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { NavigationItem, HeaderSettings } from "@/lib/types";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load navigation items and header settings from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load navigation
        const items = await storageService.getAllNavigationItems();
        setNavigationItems(items.sort((a, b) => a.order - b.order));
        
        // Load header settings
        const settings = await storageService.getHeaderSettings();
        setHeaderSettings(settings);
      } catch (error) {
        console.error('Error loading header data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to changes
    const unsubscribeNav = storageService.addEventListener('navigation-updated', loadData);
    const unsubscribeHeader = storageService.addEventListener('header-settings-updated', loadData);
    
    return () => {
      unsubscribeNav();
      unsubscribeHeader();
    };
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  // Show loading state
  if (isLoading || !headerSettings) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto h-full flex items-center">
          <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 py-3"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-display font-bold tracking-tight"
          >
            {headerSettings.logoPath ? (
              <img 
                src={headerSettings.logoPath} 
                alt={headerSettings.siteTitle} 
                className="h-8"
              />
            ) : (
              headerSettings.siteTitle
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {headerSettings.showLanguageSelector && <LanguageSelector />}
            {headerSettings.showThemeToggle && (
              <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            )}
            <Link
              to={headerSettings.contactButtonPath}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {headerSettings.contactButtonText}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label={headerSettings.mobileMenuLabel}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-40 pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-3 text-lg font-medium rounded-lg hover:bg-secondary transition-colors"
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-4">
            {headerSettings.showThemeToggle && (
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium">{t('nav.theme')}</span>
                <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
              </div>
            )}
            {headerSettings.showLanguageSelector && (
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-medium">{t('nav.language')}</span>
                <LanguageSelector />
              </div>
            )}
            <Link
              to={headerSettings.contactButtonPath}
              className="mt-4 bg-primary text-primary-foreground px-5 py-3 rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
              onClick={closeMobileMenu}
            >
              {headerSettings.contactButtonText}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export { Header };
export default Header;
