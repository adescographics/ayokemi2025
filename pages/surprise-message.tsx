"use client"
import { useState, useEffect } from "react"
import { Heart, BookOpen, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackClick } from "@/components/analytics-tracker"

export default function SurpriseMessage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    trackClick("surprise-message-page-view")
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className={`relative py-20 md:py-32 px-4 md:px-8 border-b border-gray-200 transition-all duration-1000 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Mail className="w-16 h-16 text-black" />
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-wider uppercase mb-6 text-balance">
            A Special Message
          </h1>
          <p className="text-base md:text-lg font-mono tracking-wider text-gray-600 max-w-2xl mx-auto text-pretty">
            As you celebrate with us today, we invite you to reflect on a deeper truth about love and marriage.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article
        className={`max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 transition-all duration-1000 delay-300 ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Title */}
        <header className="mb-12 text-center border-b border-gray-200 pb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-wider uppercase mb-4 text-balance">
            Herein Is Love
          </h2>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono tracking-widest uppercase text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>A Message of Hope</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 font-mono text-base md:text-lg leading-relaxed text-gray-800">
            <p className="text-pretty">
              God is fundamentally and essentially love. He is the very definition of love, and He alone is entitled to
              define what love is. Society tries to give us clues about love, but they don't have the right, because
              they don't truly know it. Love did not originate from anyone else apart from God.
            </p>

            <p className="text-pretty">
              However, we have not seen the Father in His light and glory. Hence, we would never have been able to know
              His love if He had not demonstrated it through His Son, Jesus. God made His love visible by giving us His
              only begotten Son as the substitute for our sins. What Love!
            </p>

            <div className="my-12 p-8 border-l-4 border-black bg-gray-50">
              <p className="text-lg md:text-xl italic text-gray-700 mb-2 text-pretty">
                "Herein is love, not that we loved God, but that he loved us, and sent his Son to be the propitiation
                for our sins."
              </p>
              <p className="text-sm font-medium tracking-widest uppercase text-gray-600">1 John 4:10 (KJV)</p>
            </div>

            <p className="text-pretty">
              The definition of divine love is captured in verse 10 of 1 John 4: Love has given Himself up to be the
              propitiation for the sins of another. "But Christ proved God's passionate love for us by dying in our
              place while we were still lost and ungodly!" (Romans 5:8 TPT). We were unlovable by every standard, yet
              Christ proved His love for us. He paid the ultimate price for our sins and trespasses. Oh! His love is for
              the unlovable.
            </p>

            <p className="text-pretty">
              I love how the Old King James Version starts 1 John 4:10:{" "}
              <strong className="font-semibold text-black">"Herein is love …"</strong> Love, in its highest ideal, is
              herein. That means love was all on God's side, and none on ours. It has to be God who loves you, else you
              cannot even be aware of what love is. It is not that we loved God—though He is altogether worthy of love;
              yet He loved us—though we were entirely unworthy of love.
            </p>

            <div className="my-12 p-8 border-2 border-black bg-white">
              <p className="text-xl md:text-2xl font-medium text-center mb-4 text-balance">
                "But Christ proved God's passionate love for us by dying in our place while we were still lost and
                ungodly!"
              </p>
              <p className="text-sm font-medium tracking-widest uppercase text-center text-gray-600">
                Romans 5:8 (TPT)
              </p>
            </div>

            <p className="text-pretty">
              Now here is the truth: Love is not what we naturally possess. But when a man is regenerated—born again—
              Jesus comes to dwell inside him alongside His divine love (Galatians 2:20). Yes! Regenerated men don't
              need to struggle to love again. However, if a natural man tries to exhibit love, he will still fall short
              of this divine love that Jesus embodies and gives.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-lg font-medium text-gray-700 text-balance">
                In conclusion, do you know about the love of Jesus? Do you know that He loves you with an eternal love?
                You must know this in order to walk in and manifest His divine love.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Button
            onClick={() => {
              trackClick("surprise-message-share")
              if (navigator.share) {
                navigator.share({
                  title: "Herein Is Love",
                  text: "A special message about God's love",
                  url: window.location.href,
                })
              }
            }}
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-medium tracking-widest uppercase"
          >
            Share This Message
          </Button>
        </div>
      </article>
    </div>
  )
}
