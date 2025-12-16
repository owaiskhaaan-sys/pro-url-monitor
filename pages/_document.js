import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YFHKJ1WJ61"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YFHKJ1WJ61');
            `,
          }}
        />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="2tgob67uTDkdiRiOs0DXG0wsgNQhVAcbhkhVMfqWmec" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
