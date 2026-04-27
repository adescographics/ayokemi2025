"use client"

import { useLanguage } from "@/hooks/use-language"
import type { Language } from "@/lib/i18n"

const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "EN" },
  { code: "es", name: "ES" },
  { code: "fr", name: "FR" },
  { code: "yo", name: "YO" },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-xs font-medium tracking-widest uppercase border-2 transition-all ${
            language === lang.code
              ? "bg-black text-white border-black"
              : "border-gray-300 text-black hover:border-gray-400"
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  )
}
