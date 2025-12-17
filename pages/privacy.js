import Layout from '../components/Layout';
import Head from 'next/head';

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - ProURLMonitor</title>
        <meta name="description" content="ProURLMonitor privacy policy. Learn how we collect, use, and protect your data when using our SEO tools and services." />
        <link rel="canonical" href="https://www.prourlmonitor.com/privacy" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 17, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Introduction</h2>
            <p>
              At ProURLMonitor, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and SEO tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when using our tools, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>URLs and domains you submit for analysis</li>
              <li>Account information (email, name) if you create an account</li>
              <li>Usage data and analytics through Google Analytics</li>
              <li>Technical information (IP address, browser type, device information)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our SEO analysis services</li>
              <li>Improve and optimize our tools and website</li>
              <li>Send you updates and marketing communications (with your consent)</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Third-Party Services</h2>
            <p>
              We use third-party services including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
              <li><strong>Vercel:</strong> For website hosting and deployment</li>
              <li><strong>Google PageSpeed API:</strong> For SEO audit functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-semibold">Email: privacy@prourlmonitor.com</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
