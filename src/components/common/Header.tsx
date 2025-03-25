
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/lib/i18n";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navItems = [
    { label: t('nav.home'), path: "/" },
    { label: t('nav.services'), path: "/services" },
    { label: t('nav.about'), path: "/about" },
    { label: t('nav.portfolio'), path: "/portfolio" },
    { label: t('nav.blog'), path: "/blog" },
    { label: t('nav.contact'), path: "/contact" },
  ];

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
            Trojan Envoy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
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
            <LanguageSelector />
            <ThemeToggle />
            <Link
              to="/contact"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle mobile menu"
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
          {navItems.map((item) => (
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
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-medium">{t('nav.theme')}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-medium">{t('nav.language')}</span>
              <LanguageSelector />
            </div>
            <Link
              to="/contact"
              className="mt-4 bg-primary text-primary-foreground px-5 py-3 rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
              onClick={closeMobileMenu}
            >
              {t('nav.contact')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
