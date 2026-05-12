"use client"
import { useState, useEffect } from "react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { useLanguage } from "@/hooks/use-language"

export default function StoryPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="px-4 md:px-8 py-12 md:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase mb-6 md:mb-8">
            {t("pages.storyTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Bride's Story */}
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="text-center mb-6 md:mb-8">
              <ImageWithLoading
                src="/images/design-mode/IMG-20251025-WA0016.jpg"
                alt="Elizabeth - The Bride"
                className="w-32 h-32 md:w-48 md:h-48 mx-auto object-cover rounded-full mb-4 md:mb-6"
              />
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4">
                {t("pages.elizabethStory")}
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider text-gray-600">
              <p>
                "I met my babe in August 2023 at my school brother's office. My school brother, Mr. Christian—who
                happened to be his church member—usually had him around because he often needed to charge his system for
                his freelancing work. I also visited the office during my free time to relax and charge my phone."
              </p>
              <p>
                "The very first day I saw him, I felt something special in my spirit. Later, during my quiet time, I
                talked to God about it. Surprisingly, I began to see him in my dreams. Thinking it was just my
                imagination, I stopped visiting Mr. Christian's office. But not long after, his friend, Bro. Sam, called
                to ask why I no longer came around."
              </p>
              <p>
                "Eventually, Mr. Christian asked me to help monitor his business until he found someone else, so I had
                no choice but to return. Meanwhile, God kept showing me my babe in dreams. I prayed, 'Lord, if this man
                is truly meant to be my husband, let him come to me.' Not long after, he requested my contact, and we
                began chatting."
              </p>
              <p>
                "Fast forward to April 2024, he finally shared his intentions with me. I prayed for confirmation, and
                God gave me peace about the relationship. Truly, I love him deeply."
              </p>
              <p>
                "Since meeting him, I've experienced growth in many ways—spiritually, intellectually, and even
                physically (yes, I finally achieved the body shape I once wanted 😅). Though we sometimes disagree, he
                never gets tired of me. Instead, he encourages me, supports me, and constantly pushes me to learn and
                improve."
              </p>
            </div>
          </div>

          {/* Groom's Story */}
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="text-center mb-6 md:mb-8">
              <ImageWithLoading
                src="/images/design-mode/IMG-20251025-WA0014.jpg"
                alt="Peter - The Groom"
                className="w-32 h-32 md:w-48 md:h-48 mx-auto object-cover rounded-full mb-4 md:mb-6"
              />
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4">
                {t("pages.peterStory")}
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider text-gray-600">
              <p>
                "It was around August 2023 during a period in my life when I had lost interest in relationships after a
                recent experience. At that time, I was only focused on my postgraduate studies and my new tech
                business."
              </p>
              <p>
                "One day, I went to a friend's place to work, and that was where she walked in. Honestly, the very first
                day I saw her, I felt something deep in my heart. But of course, I didn't approach her—I just greeted
                her politely. Still, she wouldn't leave my heart. I prayed about it, thinking it was just infatuation,
                and decided to sister/friend-zone her."
              </p>
              <p>
                "Fast forward to January 2024, I strongly felt it was my year to be in a relationship. Interestingly, I
                still wasn't considering her in that light. But as soon as I became intentional, I received wisdom, and
                the Holy Spirit began to speak to me about her—revealing things we had never even discussed and showing
                me how beautiful we would be together."
              </p>
              <p>
                "By April 2024, I finally shot my shot. To my joy, she already perceived me the same way, so
                there was no delay, and we began our journey together. It has been a wonderful journey, and I have grown
                to love her even better than we first met."
              </p>
              <p>"And yes, I am truly glad I made that choice. I cannot wait to spend forever with her."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
