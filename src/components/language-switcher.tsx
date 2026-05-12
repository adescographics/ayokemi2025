"use client"

import { useLanguage } from "@/hooks/use-language"
import type { Language } from "@/lib/i18n"
import { ChevronDown, Globe2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const LANGUAGES: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Espanol" },
  { code: "fr", name: "Francais" },
  { code: "yo", name: "Yoruba" },
]

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentLanguage = LANGUAGES.find((lang) => lang.code === language)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 items-center gap-2 border border-gray-300 px-3 text-xs font-medium tracking-widest uppercase text-black transition-colors hover:border-black hover:text-gray-500"
        aria-label={t("common.language")}
        aria-expanded={isOpen}
      >
        <Globe2 className="h-4 w-4" />
        <span>{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] border border-black bg-white shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`block w-full px-4 py-3 text-left text-xs font-medium tracking-widest uppercase transition-colors ${
                language === lang.code ? "bg-black text-white" : "text-black hover:bg-gray-100"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
