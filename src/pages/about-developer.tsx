"use client"
import { useState, useEffect } from "react"
import { Github, Facebook, Instagram, Twitter, Mail, MessageCircle, Youtube, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export default function AboutDeveloperPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/AdescoGraphics" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/adescographics" },
    { name: "X (Twitter)", icon: Twitter, url: "https://x.com/AaronAdejo45164" },
    { name: "GitHub", icon: Github, url: "https://github.com/adescographics" },
    { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/adescographics/" },
    { name: "Gmail", icon: Mail, url: "mailto:adescographics2023@gmail.com" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@adescographics" },
    { name: "Telegram", icon: MessageCircle, url: "https://t.me/+2347083913012" },
    { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/2347083913012" },
  ]

  return (
    <div
      className={`min-h-screen bg-white text-black font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <section className="px-4 md:px-8 py-12 md:py-16 pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img src="/assets/favicon.png" alt="Developer Logo" className="w-full h-full object-contain p-2" />
            </div>
            <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4">{t("pages.aboutDeveloper")}</h2>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-500">
              {t("pages.aboutDeveloperSubtitle")}
            </p>
          </div>

          <div
            className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-2">AARON ADEJOLA</h3>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-4">
              {t("pages.developerRole")}
            </p>
            <p className="text-xs font-mono tracking-wider text-gray-500 leading-relaxed">
              {t("pages.developerBio")}
            </p>
          </div>

          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <h4 className="text-sm font-medium tracking-widest uppercase mb-6 text-center">{t("pages.connectWithMe")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={social.name}
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white text-xs font-medium tracking-widest uppercase bg-transparent p-4 h-auto flex flex-col items-center space-y-2"
                  onClick={() => window.open(social.url, "_blank")}
                >
                  <social.icon className="w-5 h-5" />
                  <span className="text-xs">{social.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div
            className={`text-center mt-12 md:mt-16 pt-8 border-t border-gray-200 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <p className="text-xs font-mono tracking-wider text-gray-500">
              {t("pages.developerCta")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
