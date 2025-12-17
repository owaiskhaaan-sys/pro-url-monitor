import Layout from '../components/Layout';
import Head from 'next/head';

export default function Terms() {
  return (
    <Layout>
      <Head>
        <title>Terms of Service - ProURLMonitor</title>
        <meta name="description" content="ProURLMonitor terms of service. Read our terms and conditions for using our SEO tools and website monitoring services." />
        <link rel="canonical" href="https://www.prourlmonitor.com/terms" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 17, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ProURLMonitor, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">2. Use License</h2>
            <p>
              ProURLMonitor grants you a limited, non-exclusive, non-transferable license to use our SEO tools and services for personal or commercial purposes, subject to these terms.
            </p>
            <p className="mt-3">
              You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy our materials without permission</li>
              <li>Use the tools for any illegal purpose</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer materials to another person or mirror on another server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">3. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee that our services will be uninterrupted or error-free. We reserve the right to modify, suspend, or discontinue any part of our services at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">4. User Accounts</h2>
            <p>
              If you create an account, you are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">5. Acceptable Use</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Abuse or overload our servers with excessive requests</li>
              <li>Use our tools to scan websites without authorization</li>
              <li>Engage in any activity that interferes with our services</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality on ProURLMonitor are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" without warranties of any kind, either express or implied. We do not warrant that our tools will be accurate, complete, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">8. Limitation of Liability</h2>
            <p>
              ProURLMonitor shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-600 mb-3">10. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="font-semibold">Email: support@prourlmonitor.com</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
