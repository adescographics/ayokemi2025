import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Peter & Elizabeth's Wedding - December 20, 2025" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.jpg" />
        <link rel="apple-touch-icon" href="/assets/favicon.jpg" />
      </Head>
      <body className="font-mono">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
