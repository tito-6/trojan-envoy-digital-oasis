
import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { availableLanguages, useLanguage, LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { storageService } from "@/lib/storage";

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);

  useEffect(() => {
    // Load enabled languages from header settings
    const headerSettings = storageService.getHeaderSettings();
    setEnabledLanguages(headerSettings.enabledLanguages);
    
    // Subscribe to changes in header settings
    const unsubscribe = storageService.addEventListener('header-settings-updated', (settings) => {
      setEnabledLanguages(settings.enabledLanguages);
      
      // If current language is no longer enabled, switch to default
      if (!settings.enabledLanguages.includes(currentLanguage)) {
        setLanguage(settings.defaultLanguage as LanguageCode);
      }
    });
    
    return () => unsubscribe();
  }, [currentLanguage, setLanguage]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    closeDropdown();
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter available languages to only show enabled ones
  const filteredLanguages = availableLanguages.filter(lang => 
    enabledLanguages.includes(lang.code)
  );

  if (filteredLanguages.length <= 1) {
    return null;
  }

  return (
    <div className="relative language-dropdown">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">
          {currentLanguage}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={closeDropdown}
          />
          <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-20 overflow-hidden glass-card animate-fade-in">
            <ul className="py-1">
              {filteredLanguages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code as LanguageCode)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary",
                      currentLanguage === lang.code && "bg-secondary/50"
                    )}
                  >
                    {lang.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
