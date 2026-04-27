"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Copy, Check } from "lucide-react"

export default function DetailsPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <section className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h2 className="text-lg md:text-xl font-medium tracking-widest uppercase">WEDDING DETAILS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Engagement */}
          <div
            className={`text-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="border-2 border-black p-6 md:p-8">
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">ENGAGEMENT</h3>
              <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>DECEMBER 19, 2025</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>1:00 PM</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>KAJOLA-IJESA, OSOGBO</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 md:mt-4">
                  After VMT water factory, powerline area, Kajola-Ijesa, Osogbo, Osun State
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  From Ilesa Garage Junction, Head towards Ilesa for about 7km to get to Kajola, When you get to Kajola,
                  take the first turning to the right and continue on the road for about 400m you will see a sign post
                  of VMT water factory, follow the sign post till you get to the water factory, the next building after
                  the water factory is your destination.
                </p>
              </div>
            </div>
          </div>

          {/* Wedding Ceremony */}
          <div
            className={`text-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="border-2 border-black p-6 md:p-8">
              <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">
                CHURCH WEDDING
              </h3>
              <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>DECEMBER 20, 2025</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>10:00 AM</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2 md:mr-3 text-black" />
                  <span>TRINITY BAPTIST CHURCH</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 md:mt-4">
                  Kilometre 1 Lameco junction to Ifon Ilobu Road, Osogbo, Osun State
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reception */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">RECEPTION</h3>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
              <div className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2 md:mr-3 text-black" />
                <span>DECEMBER 20, 2025</span>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2 md:mr-3 text-black" />
                <span>SHORTLY AFTER THE CHURCH WEDDING</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-2 md:mr-3 text-black" />
                <span>OSBACON EVENTS CENTER</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4">
                Behind Baptist Girls' High School, Osogbo, Osun State
              </p>
            </div>
          </div>
        </div>

        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          <div className="border-2 border-black p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">WEDDING GIFT</h3>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-6">
              You can kindly send a gift to the couples using the details below
            </p>
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm font-mono tracking-wider">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Account Number:</span>
                <div className="flex items-center space-x-2">
                  <span>1955374567</span>
                  <button
                    onClick={() => copyToClipboard("1955374567")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy account number"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Account Name:</span>
                <span>FAKEYE PETER AYOOLA AND EMMANUEL ELIZABETH AJOKE</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Bank Name:</span>
                <span>Access Bank</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Phone Number:</span>
                <span>+2348167788117</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Kindly send receipt for confirmation to the phone number above</p>
          </div>
        </div>

        {/* Dress Code */}
        <div
          className={`text-center transition-all duration-700 ${
            isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "1300ms" }}
        >
          <div className="border-2 border-black p-6 md:p-8 max-w-4xl mx-auto">
            <h3 className="text-base md:text-lg font-medium tracking-widest uppercase mb-4 md:mb-6">DRESS CODE</h3>
            <p className="text-xs md:text-sm font-mono tracking-wider text-gray-600 mb-8">
              Please dress in the following colors for each event
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Engagement */}
              <div className="flex flex-col items-center">
                <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                  ENGAGEMENT
                </p>
                <div className="flex gap-3 md:gap-4 mb-4">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                    style={{ backgroundColor: "#B76E15" }}
                    title="Rusty Gold"
                  />
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                    style={{ backgroundColor: "#CC5500" }}
                    title="Burnt Orange"
                  />
                </div>
                <span className="text-xs font-medium tracking-widest uppercase text-center">
                  Rusty Gold &<br />
                  Burnt Orange
                </span>
              </div>

              {/* Church Wedding */}
              <div className="flex flex-col items-center">
                <p className="text-xs md:text-sm font-medium tracking-widest uppercase mb-4 text-gray-700">
                  Church Wedding
                </p>
                <div className="flex gap-3 md:gap-4 mb-4">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                    style={{ backgroundColor: "#FFD700" }}
                    title="Mustard Yellow"
                  />
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 border-2 border-black shadow-lg"
                    style={{ backgroundColor: "#800020" }}
                    title="Burgundy"
                  />
                </div>
                <span className="text-xs font-medium tracking-widest uppercase text-center">
                  Mustard Yellow &<br />
                  Burgundy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
