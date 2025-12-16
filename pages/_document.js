import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Analytics - Replace with your tracking ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* Google Search Console Verification - Replace with your code */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
