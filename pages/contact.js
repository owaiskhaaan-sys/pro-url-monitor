import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in Name, Email, and Comments before sending.' });
      return;
    }
    // Simulate submit
    setStatus({ type: 'success', text: 'Thanks! We received your message and will reply shortly.' });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-2">Contact</p>
        <h1 className="text-4xl font-bold text-emerald-800 mb-3">Contact ProURLMonitor</h1>
        <p className="text-gray-600 mb-8">We are here to help with domain monitoring, uptime, and SEO tooling. We typically reply within one business day.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Contact Details</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><span className="font-semibold text-gray-900">Address:</span> Karachi, Pakistan</li>
                <li><span className="font-semibold text-gray-900">Email:</span> <a href="mailto:info@prourlmonitor.com" className="text-emerald-700 hover:underline">info@prourlmonitor.com</a></li>
                <li><span className="font-semibold text-gray-900">Response time:</span> Within one business day</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Notes</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-emerald-900">
                <li>For partnership or API inquiries, mention "Partnership/API" in your message.</li>
                <li>For support, include your domain and the tool you are using.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Send us a message</h3>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700" htmlFor="message">Comments</label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500 resize-y"
                placeholder="How can we help?"
              />
            </div>

            {status && (
              <div className={`${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'} border px-3 py-2 rounded text-sm`}>
                {status.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
