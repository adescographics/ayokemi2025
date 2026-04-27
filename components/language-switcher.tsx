"use client"

import { useLanguage } from "@/hooks/use-language"
import type { Language } from "@/lib/i18n"
import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "yo", name: "Yorùbá" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  // Close dropdown when clicking outside
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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded text-xs font-medium tracking-widest uppercase hover:text-gray-500 transition-colors text-black border border-gray-300 hover:border-black"
        aria-label="Change language"
      >
        <span>{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-50 border border-black bg-white rounded shadow-lg min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-xs font-medium tracking-widest uppercase transition-colors ${
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
