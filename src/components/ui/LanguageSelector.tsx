
import React, { useState, useEffect } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";

export function LanguageSelector() {
  const { availableLanguages, currentLanguage, changeLanguage } = useLanguage();
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>("en");

  useEffect(() => {
    // Get enabled languages from header settings
    const settings = storageService.getHeaderSettings();
    setEnabledLanguages(settings.enabledLanguages || ["en"]);
    setDefaultLanguage(settings.defaultLanguage || "en");

    // Subscribe to settings updates
    const handleSettingsUpdate = () => {
      const updatedSettings = storageService.getHeaderSettings();
      setEnabledLanguages(updatedSettings.enabledLanguages || ["en"]);
      setDefaultLanguage(updatedSettings.defaultLanguage || "en");
    };

    window.addEventListener('header-settings-updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('header-settings-updated', handleSettingsUpdate);
    };
  }, []);

  // Filter available languages based on enabled languages
  const filteredLanguages = availableLanguages.filter(
    (lang) => enabledLanguages.includes(lang.code)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filteredLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.label}</span>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
