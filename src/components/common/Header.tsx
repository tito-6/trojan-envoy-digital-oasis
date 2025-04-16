import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { NavigationItem } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Logo = () => (
  <div className="relative flex items-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="font-display font-bold tracking-tight text-xl z-10 relative"
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
        Trojan Envoy
      </span>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="absolute -left-1 w-8 h-8 bg-primary/20 rounded-full blur-md -z-10"
    />
    <motion.div
      className="absolute top-0 -right-2 w-3 h-3"
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles className="w-full h-full text-primary/70" />
    </motion.div>
  </div>
);

const NavLinkItem = ({
  to,
  children,
  isMobile = false,
  onClick = () => {},
}: {
  to: string;
  children: React.ReactNode;
  isMobile?: boolean;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "block px-4 py-2 rounded transition-colors",
        isMobile
          ? "text-lg font-semibold text-foreground hover:text-primary"
          : "text-sm font-medium hover:bg-secondary/80",
        isActive && "text-primary"
      )}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const { t } = useLanguage();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Change header background when scrolling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load navigation items
  useEffect(() => {
    const loadNavigation = () => {
      const items = storageService.getAllNavigationItems();
      setNavigationItems([...items].sort((a, b) => a.order - b.order));
    };
    loadNavigation();
    const unsubscribe = storageService.addEventListener(
      "navigation-updated",
      loadNavigation
    );
    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      document.body.style.overflow = prev ? "auto" : "hidden";
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 backdrop-blur-md transition-all duration-500",
        isScrolled
          ? "bg-background/80 border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <NavLinkItem key={item.path} to={item.path}>
                {item.label}
              </NavLinkItem>
            ))}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector />
            <Link
              to="/contact"
              className="bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
            >
              {t("nav.contact")}
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-secondary"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="md:hidden w-[80%] p-0 bg-white dark:bg-gray-900 border-l border-border/50"
              >
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-foreground">Menu</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                      {t("nav.navigate")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <Link
                      to="/"
                      className="inline-flex items-center font-semibold text-foreground mb-6"
                      onClick={closeMobileMenu}
                    >
                      Trojan Envoy
                    </Link>
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <NavLinkItem
                          key={item.path}
                          to={item.path}
                          isMobile
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </NavLinkItem>
                      ))}
                      <Link
                        to="/contact"
                        onClick={closeMobileMenu}
                        className="block bg-gradient-to-r from-primary to-purple-600 text-white text-center py-3 rounded-lg font-medium hover:opacity-90"
                      >
                        {t("nav.contact")}
                      </Link>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
