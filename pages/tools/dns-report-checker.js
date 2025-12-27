import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function DNSReportChecker() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDNSReport = async () => {
    if (!domain.trim()) {
      alert('Please enter a domain name');
      return;
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    setIsChecking(true);
    setResults(null);

    try {
      // Get DNS records
      const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA'];
      const dnsData = {};

      for (const type of recordTypes) {
        try {
          const response = await fetch('/api/dns-lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: cleanDomain, recordType: type })
          });
          const data = await response.json();
          dnsData[type] = data.Answer || [];
        } catch (err) {
          dnsData[type] = [];
        }
      }

      // Analyze DNS health
      const analysis = analyzeDNSHealth(cleanDomain, dnsData);
      
      setResults({
        domain: cleanDomain,
        records: dnsData,
        analysis: analysis,
        score: calculateScore(analysis),
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      alert('Failed to check DNS report. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const analyzeDNSHealth = (domain, records) => {
    const issues = [];
    const warnings = [];
    const recommendations = [];
    const passed = [];

    // Check A records
    if (records.A.length === 0) {
      issues.push({
        type: 'Critical',
        category: 'A Records',
        message: 'No A records found',
        description: 'Domain has no IPv4 address records. Website will be inaccessible.',
        fix: 'Add at least one A record pointing to your server IP address.'
      });
    } else if (records.A.length === 1) {
      warnings.push({
        type: 'Warning',
        category: 'A Records',
        message: 'Single A record found',
        description: 'Only one A record exists. No redundancy for failover.',
        fix: 'Consider adding multiple A records for load balancing and redundancy.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'A Records',
        message: `${records.A.length} A records found`,
        description: 'Multiple A records provide redundancy and load balancing.'
      });
    }

    // Check AAAA records
    if (records.AAAA.length === 0) {
      recommendations.push({
        type: 'Info',
        category: 'IPv6 Support',
        message: 'No AAAA records found',
        description: 'Domain lacks IPv6 support.',
        fix: 'Add AAAA records to support IPv6 connectivity for modern networks.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'IPv6 Support',
        message: `${records.AAAA.length} AAAA records found`,
        description: 'Domain supports IPv6 connectivity.'
      });
    }

    // Check MX records
    if (records.MX.length === 0) {
      warnings.push({
        type: 'Warning',
        category: 'Email Setup',
        message: 'No MX records found',
        description: 'Domain cannot receive emails.',
        fix: 'Add MX records if you want to receive emails at this domain.'
      });
    } else if (records.MX.length === 1) {
      warnings.push({
        type: 'Warning',
        category: 'Email Setup',
        message: 'Single MX record found',
        description: 'No backup mail server configured.',
        fix: 'Add secondary MX records for email redundancy.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'Email Setup',
        message: `${records.MX.length} MX records found`,
        description: 'Multiple mail servers configured for redundancy.'
      });
    }

    // Check TXT records (SPF, DKIM, DMARC)
    const txtRecords = records.TXT.map(r => r.data.toLowerCase());
    const hasSPF = txtRecords.some(txt => txt.includes('v=spf1'));
    const hasDMARC = txtRecords.some(txt => txt.includes('v=dmarc1'));
    const hasDKIM = txtRecords.some(txt => txt.includes('dkim'));

    if (!hasSPF) {
      warnings.push({
        type: 'Warning',
        category: 'Email Security',
        message: 'No SPF record found',
        description: 'SPF (Sender Policy Framework) not configured.',
        fix: 'Add SPF TXT record to prevent email spoofing: v=spf1 include:_spf.google.com ~all'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'Email Security',
        message: 'SPF record configured',
        description: 'Email authentication via SPF is active.'
      });
    }

    if (!hasDMARC) {
      recommendations.push({
        type: 'Info',
        category: 'Email Security',
        message: 'No DMARC record found',
        description: 'DMARC policy not configured.',
        fix: 'Add DMARC TXT record at _dmarc subdomain for email authentication.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'Email Security',
        message: 'DMARC record configured',
        description: 'Email policy enforcement via DMARC is active.'
      });
    }

    // Check NS records
    if (records.NS.length < 2) {
      issues.push({
        type: 'Critical',
        category: 'Name Servers',
        message: 'Insufficient name servers',
        description: 'Less than 2 name servers configured.',
        fix: 'Configure at least 2 name servers for redundancy (RFC 1034 requirement).'
      });
    } else if (records.NS.length < 3) {
      warnings.push({
        type: 'Warning',
        category: 'Name Servers',
        message: 'Minimal name servers',
        description: 'Only 2 name servers configured.',
        fix: 'Consider adding 3-4 name servers for better redundancy.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'Name Servers',
        message: `${records.NS.length} name servers configured`,
        description: 'Adequate DNS redundancy configured.'
      });
    }

    // Check SOA record
    if (records.SOA.length === 0) {
      issues.push({
        type: 'Critical',
        category: 'SOA Record',
        message: 'No SOA record found',
        description: 'Start of Authority record missing.',
        fix: 'SOA record is required for proper DNS zone functioning.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'SOA Record',
        message: 'SOA record found',
        description: 'Zone authority information properly configured.'
      });
    }

    // Check TTL values
    const allRecords = [...records.A, ...records.AAAA, ...records.MX, ...records.NS];
    const avgTTL = allRecords.length > 0 
      ? allRecords.reduce((sum, r) => sum + (r.TTL || 0), 0) / allRecords.length 
      : 0;

    if (avgTTL < 300) {
      warnings.push({
        type: 'Warning',
        category: 'TTL Values',
        message: 'Very low TTL values',
        description: `Average TTL is ${Math.round(avgTTL)}s (under 5 minutes).`,
        fix: 'Low TTL increases DNS query load. Consider 300-3600 seconds for production.'
      });
    } else if (avgTTL > 86400) {
      recommendations.push({
        type: 'Info',
        category: 'TTL Values',
        message: 'Very high TTL values',
        description: `Average TTL is ${Math.round(avgTTL)}s (over 24 hours).`,
        fix: 'High TTL slows DNS changes propagation. Consider 3600-43200 for flexibility.'
      });
    } else {
      passed.push({
        type: 'Success',
        category: 'TTL Values',
        message: 'Optimal TTL range',
        description: `Average TTL is ${Math.round(avgTTL)}s (5 min - 24 hours).`
      });
    }

    return { issues, warnings, recommendations, passed };
  };

  const calculateScore = (analysis) => {
    const { issues, warnings, recommendations, passed } = analysis;
    let score = 100;
    
    score -= issues.length * 15;
    score -= warnings.length * 8;
    score -= recommendations.length * 3;
    
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const loadExample = () => {
    setDomain('google.com');
  };

  const exportReport = () => {
    if (!results) return;
    
    let text = `DNS Health Report for ${results.domain}\n`;
    text += `Generated: ${results.timestamp}\n`;
    text += `Overall Score: ${results.score}/100 (Grade ${getScoreGrade(results.score)})\n\n`;
    
    text += `=== CRITICAL ISSUES (${results.analysis.issues.length}) ===\n`;
    results.analysis.issues.forEach((issue, idx) => {
      text += `${idx + 1}. [${issue.category}] ${issue.message}\n`;
      text += `   ${issue.description}\n`;
      text += `   Fix: ${issue.fix}\n\n`;
    });
    
    text += `\n=== WARNINGS (${results.analysis.warnings.length}) ===\n`;
    results.analysis.warnings.forEach((warn, idx) => {
      text += `${idx + 1}. [${warn.category}] ${warn.message}\n`;
      text += `   ${warn.description}\n`;
      text += `   Fix: ${warn.fix}\n\n`;
    });
    
    text += `\n=== RECOMMENDATIONS (${results.analysis.recommendations.length}) ===\n`;
    results.analysis.recommendations.forEach((rec, idx) => {
      text += `${idx + 1}. [${rec.category}] ${rec.message}\n`;
      text += `   ${rec.description}\n`;
      text += `   Fix: ${rec.fix}\n\n`;
    });
    
    text += `\n=== PASSED CHECKS (${results.analysis.passed.length}) ===\n`;
    results.analysis.passed.forEach((pass, idx) => {
      text += `${idx + 1}. [${pass.category}] ${pass.message}\n`;
      text += `   ${pass.description}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-report-${results.domain}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <Head>
        <title>DNS Report Checker - Complete DNS Health Analysis | ProURLMonitor</title>
        <meta name="description" content="Free DNS Report Checker. Comprehensive DNS health analysis with scores, issues, warnings, and recommendations. Check DNS configuration quality." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">DNS Report Checker</h1>
        <p className="text-gray-600 mb-8 text-center">
          Complete DNS health analysis with score, issues, and recommendations!
        </p>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Domain Name:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkDNSReport()}
                placeholder="example.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={loadExample}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Example
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={checkDNSReport}
              disabled={isChecking}
              className={`btn btn-primary px-12 py-3 text-lg ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isChecking ? 'Analyzing DNS...' : 'Check DNS Report'}
            </button>
          </div>

          {results && (
            <div className="space-y-6">
              {/* Score Overview */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">DNS Health Score</h2>
                    <p className="text-indigo-100">{results.domain} • {results.timestamp}</p>
                  </div>
                  <button
                    onClick={exportReport}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50"
                  >
                    📥 Export Report
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className={`text-7xl font-bold mb-2 ${getScoreColor(results.score).replace('text-', 'text-')}`} style={{color: 'white'}}>
                      {results.score}
                    </div>
                    <div className="text-2xl">out of 100</div>
                  </div>
                  <div className="text-center">
                    <div className="text-7xl font-bold mb-2">
                      {getScoreGrade(results.score)}
                    </div>
                    <div className="text-xl">Grade</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.analysis.issues.length}</div>
                    <div className="text-sm">Critical Issues</div>
                  </div>
                  <div className="bg-yellow-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.analysis.warnings.length}</div>
                    <div className="text-sm">Warnings</div>
                  </div>
                  <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.analysis.recommendations.length}</div>
                    <div className="text-sm">Recommendations</div>
                  </div>
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">{results.analysis.passed.length}</div>
                    <div className="text-sm">Passed Checks</div>
                  </div>
                </div>
              </div>

              {/* Critical Issues */}
              {results.analysis.issues.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border-2 border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">🚨 Critical Issues ({results.analysis.issues.length})</h2>
                  <div className="space-y-3">
                    {results.analysis.issues.map((issue, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">❌</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-red-800">{issue.message}</h3>
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                {issue.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                            <div className="bg-red-50 p-3 rounded">
                              <p className="text-xs text-red-800"><strong>Fix:</strong> {issue.fix}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {results.analysis.warnings.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Warnings ({results.analysis.warnings.length})</h2>
                  <div className="space-y-3">
                    {results.analysis.warnings.map((warning, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-yellow-500">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-yellow-800">{warning.message}</h3>
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                {warning.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{warning.description}</p>
                            <div className="bg-yellow-50 p-3 rounded">
                              <p className="text-xs text-yellow-800"><strong>Fix:</strong> {warning.fix}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {results.analysis.recommendations.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Recommendations ({results.analysis.recommendations.length})</h2>
                  <div className="space-y-3">
                    {results.analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💡</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-blue-800">{rec.message}</h3>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                {rec.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-xs text-blue-800"><strong>Suggestion:</strong> {rec.fix}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passed Checks */}
              {results.analysis.passed.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">✅ Passed Checks ({results.analysis.passed.length})</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {results.analysis.passed.map((pass, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">✅</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-800 mb-1">{pass.message}</h3>
                            <p className="text-xs text-gray-600">{pass.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is DNS Report Checker?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>DNS Report Checker</strong> is a comprehensive diagnostic tool that analyzes your domain's DNS configuration and provides a detailed health report with scores, issues, warnings, and recommendations. Unlike simple DNS lookup tools, a DNS report checker evaluates DNS best practices, security configurations, redundancy, and performance optimization.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our free DNS Report Checker examines A records, AAAA records, MX records, TXT records (SPF, DKIM, DMARC), NS records, SOA records, and TTL values to provide an overall DNS health score from 0-100 with actionable recommendations for improvement.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What Does DNS Report Check?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌐 A & AAAA Records</h3>
                <p className="text-sm text-gray-700">IPv4 and IPv6 address configuration, redundancy, load balancing setup.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">📧 MX Records</h3>
                <p className="text-sm text-gray-700">Mail server configuration, backup MX setup, priority levels.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🔒 Email Security</h3>
                <p className="text-sm text-gray-700">SPF, DKIM, DMARC records for email authentication and anti-spoofing.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🌍 Name Servers</h3>
                <p className="text-sm text-gray-700">NS record count, redundancy compliance, geographic distribution.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">⚙️ SOA Record</h3>
                <p className="text-sm text-gray-700">Zone authority information, serial numbers, refresh intervals.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">⏱️ TTL Values</h3>
                <p className="text-sm text-gray-700">Time-to-live optimization for performance and flexibility.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">DNS Health Score Grades</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Score Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">90-100</td><td className="border border-gray-300 px-4 py-2">A</td><td className="border border-gray-300 px-4 py-2 text-green-600">Excellent</td><td className="border border-gray-300 px-4 py-2 text-sm">DNS optimally configured</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">80-89</td><td className="border border-gray-300 px-4 py-2">B</td><td className="border border-gray-300 px-4 py-2 text-blue-600">Good</td><td className="border border-gray-300 px-4 py-2 text-sm">Minor improvements recommended</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">70-79</td><td className="border border-gray-300 px-4 py-2">C</td><td className="border border-gray-300 px-4 py-2 text-yellow-600">Fair</td><td className="border border-gray-300 px-4 py-2 text-sm">Address warnings soon</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">60-69</td><td className="border border-gray-300 px-4 py-2">D</td><td className="border border-gray-300 px-4 py-2 text-orange-600">Poor</td><td className="border border-gray-300 px-4 py-2 text-sm">Immediate attention required</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">0-59</td><td className="border border-gray-300 px-4 py-2">F</td><td className="border border-gray-300 px-4 py-2 text-red-600">Critical</td><td className="border border-gray-300 px-4 py-2 text-sm">Critical issues must be fixed</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related DNS Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/dns-records-checker" className="hover:text-emerald-600">🌐 DNS Records Checker</a>
                </h3>
                <p className="text-sm text-gray-700">View detailed DNS records for any domain.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/reverse-ns-checker" className="hover:text-emerald-600">🔄 Reverse NS Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Find domains using specific nameservers.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">📊 SEO Audit</a>
                </h3>
                <p className="text-sm text-gray-700">Complete website SEO analysis.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/http-status-checker" className="hover:text-emerald-600">🔍 HTTP Status Checker</a>
                </h3>
                <p className="text-sm text-gray-700">Check HTTP response codes.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a good DNS health score?</h3>
                <p className="text-gray-700 text-sm">A: A score of 90+ (Grade A) indicates excellent DNS configuration. Scores 80-89 (Grade B) are good with minor improvements needed. Below 70 requires attention.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Why is my DNS score low?</h3>
                <p className="text-gray-700 text-sm">A: Low scores typically result from missing records (MX, SPF, DMARC), insufficient name servers (less than 2), or no IPv6 support. Check the critical issues and warnings sections for specific problems.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What are SPF, DKIM, and DMARC?</h3>
                <p className="text-gray-700 text-sm">A: These are email authentication protocols. SPF specifies authorized mail servers, DKIM adds digital signatures to emails, and DMARC defines policies for handling failed authentication. All three protect against email spoofing.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many name servers should I have?</h3>
                <p className="text-gray-700 text-sm">A: RFC 1034 requires at least 2 name servers for redundancy. We recommend 3-4 name servers for optimal reliability and geographic distribution.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a good TTL value?</h3>
                <p className="text-gray-700 text-sm">A: For production sites, 300-3600 seconds (5 minutes to 1 hour) is optimal. Lower values increase DNS queries but allow faster updates. Higher values reduce load but slow propagation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this DNS report checker free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited checks. No registration or payment required. Get comprehensive DNS health reports instantly.</p>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">📊 Check Your DNS Health Now!</h2>
            <p className="mb-4">
              Use our <strong>free DNS Report Checker</strong> to get a comprehensive DNS health analysis with scores, issues, warnings, and actionable recommendations. Perfect for domain administrators, developers, and IT professionals.
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/dns-records-checker" className="text-indigo-100 hover:text-white underline">DNS Records</a> • <a href="/tools/reverse-ns-checker" className="text-indigo-100 hover:text-white underline">Reverse NS</a> • <a href="/tools/seo-audit" className="text-indigo-100 hover:text-white underline">SEO Audit</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
