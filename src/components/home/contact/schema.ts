
import { z } from "zod";

// Define the country codes for the dropdown
export const countryCodes = [
  { code: "+1", country: "US", label: "United States (+1)", flag: "🇺🇸" },
  { code: "+44", country: "UK", label: "United Kingdom (+44)", flag: "🇬🇧" },
  { code: "+91", country: "IN", label: "India (+91)", flag: "🇮🇳" },
  { code: "+61", country: "AU", label: "Australia (+61)", flag: "🇦🇺" },
  { code: "+33", country: "FR", label: "France (+33)", flag: "🇫🇷" },
  { code: "+49", country: "DE", label: "Germany (+49)", flag: "🇩🇪" },
  { code: "+86", country: "CN", label: "China (+86)", flag: "🇨🇳" },
  { code: "+81", country: "JP", label: "Japan (+81)", flag: "🇯🇵" },
  { code: "+82", country: "KR", label: "South Korea (+82)", flag: "🇰🇷" },
  { code: "+55", country: "BR", label: "Brazil (+55)", flag: "🇧🇷" },
  { code: "+52", country: "MX", label: "Mexico (+52)", flag: "🇲🇽" },
  { code: "+34", country: "ES", label: "Spain (+34)", flag: "🇪🇸" },
  { code: "+39", country: "IT", label: "Italy (+39)", flag: "🇮🇹" },
  { code: "+7", country: "RU", label: "Russia (+7)", flag: "🇷🇺" },
  { code: "+27", country: "ZA", label: "South Africa (+27)", flag: "🇿🇦" }
];

// Define the phone number regex for different countries
export const phoneRegexMap: Record<string, RegExp> = {
  US: /^\d{10}$/, // US: 10 digits
  UK: /^\d{10,11}$/, // UK: 10-11 digits
  IN: /^\d{10}$/, // India: 10 digits
  AU: /^\d{9,10}$/, // Australia: 9-10 digits
  FR: /^\d{9}$/, // France: 9 digits
  DE: /^\d{10,11}$/, // Germany: 10-11 digits
  CN: /^\d{11}$/, // China: 11 digits
  JP: /^\d{10,11}$/, // Japan: 10-11 digits
  KR: /^\d{9,10}$/, // South Korea: 9-10 digits
  BR: /^\d{10,11}$/, // Brazil: 10-11 digits
  MX: /^\d{10}$/, // Mexico: 10 digits
  ES: /^\d{9}$/, // Spain: 9 digits
  IT: /^\d{10}$/, // Italy: 10 digits
  RU: /^\d{10}$/, // Russia: 10 digits
  ZA: /^\d{9}$/, // South Africa: 9 digits
  DEFAULT: /^\d{7,15}$/, // Generic: 7-15 digits
};

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  countryCode: z.string().default("+1"),
  phoneNumber: z.string().refine((val) => {
    // This will be validated with the selected country code
    return true;
  }, { message: "Invalid phone number format" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})
.refine((data) => {
  // Get the country from the country code
  const countryObj = countryCodes.find(c => c.code === data.countryCode);
  const country = countryObj ? countryObj.country : "DEFAULT";
  
  // Get the regex for that country
  const regex = phoneRegexMap[country] || phoneRegexMap.DEFAULT;
  
  // Test the phone number against the regex
  return regex.test(data.phoneNumber.replace(/\D/g, ''));
}, {
  message: "Invalid phone number for the selected country",
  path: ["phoneNumber"]
});

export type ContactFormData = z.infer<typeof contactSchema>;
