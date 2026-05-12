"use client"

import type { AppProps } from "next/app"
import "../styles/globals.css"
import Layout from "../components/Layout"
import { LanguageProvider } from "@/hooks/use-language"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  )
}
