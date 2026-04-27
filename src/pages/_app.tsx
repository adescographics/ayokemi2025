"use client"

import type { AppProps } from "next/app"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import "../styles/globals.css"
import Layout from "../components/Layout"

export default function App({ Component, pageProps }: AppProps) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setShowWelcome(false)
      }, 500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[100]">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Heart className="h-12 w-12 text-black mr-4" />
            <span className="text-2xl font-mono font-medium tracking-widest uppercase">E & P</span>
          </div>

          <h1 className="text-lg font-mono font-medium tracking-widest uppercase mb-8">Welcome to Our Website</h1>

          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoading && (
            <div className="animate-fade-in">
              <p className="text-sm font-mono tracking-wider text-gray-600">Loading your experience...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
