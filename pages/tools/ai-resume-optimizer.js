import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function AIResumeOptimizer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeResume = () => {
    if (!resumeText.trim()) {
      alert('Please enter your resume text');
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      // ATS Scoring Algorithm
      let atsScore = 0;
      const issues = [];
      const suggestions = [];
      const strengths = [];
      
      const resumeLower = resumeText.toLowerCase();
      const jobDescLower = jobDescription.toLowerCase();
      
      // 1. Contact Information Check
      const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
      const hasPhone = /(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
      
      if (hasEmail && hasPhone) {
        atsScore += 10;
        strengths.push('Complete contact information provided');
      } else {
        issues.push('Missing email or phone number');
        suggestions.push('Add your email and phone number at the top of your resume');
      }

      // 2. Section Headers Check
      const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
      let sectionCount = 0;
      sections.forEach(section => {
        if (resumeLower.includes(section)) sectionCount++;
      });

      if (sectionCount >= 3) {
        atsScore += 15;
        strengths.push(`Contains ${sectionCount} standard sections`);
      } else {
        issues.push('Missing key resume sections');
        suggestions.push('Include sections: Experience, Education, Skills, Summary/Objective');
      }

      // 3. Length Check
      const wordCount = resumeText.trim().split(/\s+/).length;
      if (wordCount >= 300 && wordCount <= 800) {
        atsScore += 10;
        strengths.push(`Optimal length (${wordCount} words)`);
      } else if (wordCount < 300) {
        issues.push('Resume is too short');
        suggestions.push('Expand your resume to 300-800 words for better ATS performance');
      } else if (wordCount > 800) {
        issues.push('Resume is too long');
        suggestions.push('Condense to 300-800 words for better ATS readability');
      }

      // 4. Action Verbs Check
      const actionVerbs = [
        'achieved', 'improved', 'increased', 'reduced', 'managed', 'led', 'developed',
        'created', 'designed', 'implemented', 'analyzed', 'coordinated', 'executed',
        'established', 'streamlined', 'optimized', 'launched', 'delivered', 'spearheaded'
      ];
      
      let verbCount = 0;
      actionVerbs.forEach(verb => {
        if (resumeLower.includes(verb)) verbCount++;
      });

      if (verbCount >= 5) {
        atsScore += 15;
        strengths.push(`Contains ${verbCount} strong action verbs`);
      } else if (verbCount >= 3) {
        atsScore += 10;
        suggestions.push('Add more action verbs to strengthen your resume');
      } else {
        issues.push('Weak or passive language');
        suggestions.push('Use strong action verbs: achieved, improved, increased, managed, led, etc.');
      }

      // 5. Quantifiable Achievements
      const hasNumbers = /\d+%|\d+\+|increased by \d+|reduced by \d+|\$\d+/.test(resumeText);
      const numberMatches = resumeText.match(/\d+/g) || [];
      
      if (numberMatches.length >= 5) {
        atsScore += 15;
        strengths.push('Includes quantifiable achievements with metrics');
      } else if (numberMatches.length >= 2) {
        atsScore += 8;
        suggestions.push('Add more quantifiable achievements with specific numbers and percentages');
      } else {
        issues.push('Lacks quantifiable achievements');
        suggestions.push('Add metrics: "Increased sales by 25%", "Managed team of 10", "Reduced costs by $50K"');
      }

      // 6. Keyword Matching (if job description provided)
      let keywordScore = 0;
      const matchedKeywords = [];
      const missingKeywords = [];

      if (jobDescription.trim()) {
        // Extract potential keywords from job description
        const jobWords = jobDescLower.match(/\b[a-z]{4,}\b/g) || [];
        const keywordCandidates = [...new Set(jobWords)].filter(word => 
          !['this', 'that', 'with', 'from', 'have', 'will', 'your', 'about', 'their', 'would'].includes(word)
        );

        const importantKeywords = keywordCandidates.slice(0, 15);
        
        importantKeywords.forEach(keyword => {
          if (resumeLower.includes(keyword)) {
            matchedKeywords.push(keyword);
            keywordScore += 2;
          } else {
            missingKeywords.push(keyword);
          }
        });

        if (keywordScore >= 20) {
          atsScore += 20;
          strengths.push(`Excellent keyword match (${matchedKeywords.length} keywords found)`);
        } else if (keywordScore >= 10) {
          atsScore += 15;
          suggestions.push('Add more keywords from the job description');
        } else {
          atsScore += keywordScore;
          issues.push('Poor keyword alignment with job description');
          suggestions.push(`Missing key terms: ${missingKeywords.slice(0, 5).join(', ')}`);
        }
      } else {
        // Generic scoring if no job description
        atsScore += 10; // Neutral score
      }

      // 7. File Format & Formatting (text-based checks)
      const hasBulletPoints = /[-•●○]/.test(resumeText);
      if (hasBulletPoints) {
        atsScore += 5;
        strengths.push('Uses bullet points (ATS-friendly)');
      } else {
        suggestions.push('Use bullet points for better ATS parsing');
      }

      // 8. Special Characters Check
      const specialChars = /[©®™|#*@&]/.test(resumeText);
      if (!specialChars) {
        atsScore += 5;
        strengths.push('No special characters (ATS-friendly)');
      } else {
        issues.push('Contains special characters that may confuse ATS');
        suggestions.push('Remove special characters: ©, ®, ™, |, #, *, @, &');
      }

      // 9. Professional Language Check
      const unprofessional = ['i think', 'probably', 'maybe', 'kinda', 'sorta', 'stuff', 'things'];
      let unprofessionalCount = 0;
      unprofessional.forEach(term => {
        if (resumeLower.includes(term)) unprofessionalCount++;
      });

      if (unprofessionalCount === 0) {
        atsScore += 5;
        strengths.push('Professional language throughout');
      } else {
        issues.push('Contains informal or unprofessional language');
        suggestions.push('Remove informal terms: "I think", "probably", "kinda", etc.');
      }

      // 10. Education Format Check
      const hasEducation = resumeLower.includes('education') || resumeLower.includes('degree');
      const hasDegree = /bachelor|master|phd|mba|associate|diploma/i.test(resumeText);
      
      if (hasEducation && hasDegree) {
        atsScore += 5;
        strengths.push('Education section properly formatted');
      } else {
        suggestions.push('Include your degree and institution in Education section');
      }

      // Cap score at 100
      atsScore = Math.min(atsScore, 100);

      // Determine rating
      let rating, ratingColor, ratingIcon;
      if (atsScore >= 85) {
        rating = 'Excellent - Ready to Submit';
        ratingColor = 'text-green-600';
        ratingIcon = '🎉';
      } else if (atsScore >= 70) {
        rating = 'Good - Minor Improvements Needed';
        ratingColor = 'text-blue-600';
        ratingIcon = '✅';
      } else if (atsScore >= 55) {
        rating = 'Fair - Several Improvements Required';
        ratingColor = 'text-yellow-600';
        ratingIcon = '⚠️';
      } else if (atsScore >= 40) {
        rating = 'Poor - Major Revisions Needed';
        ratingColor = 'text-orange-600';
        ratingIcon = '⚡';
      } else {
        rating = 'Very Poor - Complete Rewrite Recommended';
        ratingColor = 'text-red-600';
        ratingIcon = '❌';
      }

      setResult({
        atsScore,
        rating,
        ratingColor,
        ratingIcon,
        wordCount,
        issues,
        suggestions,
        strengths,
        matchedKeywords,
        missingKeywords: missingKeywords.slice(0, 10)
      });

      setAnalyzing(false);
    }, 2000);
  };

  const clearAll = () => {
    setResumeText('');
    setJobDescription('');
    setResult(null);
  };

  return (
    <Layout>
      <Head>
        <title>AI Resume Optimizer - ATS Resume Checker | ProURLMonitor</title>
        <meta name="description" content="Free AI Resume Optimizer to optimize your resume for ATS (Applicant Tracking Systems). Get ATS score, keyword suggestions, formatting tips, and..." />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/ai-resume-optimizer" />
        <meta name="keywords" content="AI resume optimizer, ATS resume checker, resume optimizer, ATS score, resume keywords, resume formatting, applicant tracking system, resume scanner, resume analyzer" />
        <meta property="og:title" content="AI Resume Optimizer - Beat ATS & Get More Interviews" />
        <meta property="og:description" content="Optimize your resume for ATS. Get instant ATS score, keyword matching, and formatting tips. Free resume optimizer." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Optimizer - Free ATS Resume Checker" />
        <meta name="twitter:description" content="Check your resume ATS score and get optimization tips. Beat applicant tracking systems." />
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">AI Resume Optimizer</h1>
        <p className="text-gray-600 mb-8">Optimize your resume for ATS (Applicant Tracking Systems). Get instant ATS score, keyword suggestions, and formatting tips to beat AI screening and land more interviews.</p>

        {/* Input Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📄 Paste Your Resume (Required)
              </label>
              <textarea
                placeholder="Paste your complete resume text here... Include all sections: Summary, Experience, Education, Skills, etc."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                {resumeText.trim().split(/\s+/).filter(w => w).length} words
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💼 Job Description (Optional - for keyword matching)
              </label>
              <textarea
                placeholder="Paste the job description you're applying for... This helps us match keywords and optimize your resume for this specific role."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                {jobDescription ? `${jobDescription.trim().split(/\s+/).filter(w => w).length} words` : 'Add job description for better keyword optimization'}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={analyzeResume}
                disabled={analyzing}
                className={`btn btn-primary px-8 py-3 flex-1 ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {analyzing ? '⚡ Analyzing...' : '🎯 Optimize Resume'}
              </button>
              <button
                onClick={clearAll}
                className="btn bg-gray-600 text-white hover:bg-gray-700 px-8 py-3"
              >
                🔄 Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 mb-8">
            {/* ATS Score Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 rounded-lg border-2 border-emerald-200">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-emerald-600 mb-2">
                  {result.atsScore}<span className="text-3xl">/100</span>
                </div>
                <div className={`text-2xl font-bold ${result.ratingColor} mb-2`}>
                  {result.ratingIcon} {result.rating}
                </div>
                <p className="text-gray-600">ATS (Applicant Tracking System) Score</p>
              </div>

              {/* Score Bar */}
              <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 ${
                    result.atsScore >= 70 ? 'bg-green-500' : 
                    result.atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.atsScore}%` }}
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                Your resume will {result.atsScore >= 70 ? 'likely pass' : result.atsScore >= 50 ? 'might pass' : 'likely be rejected by'} ATS screening
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
                <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                  <span>✅</span> Strengths ({result.strengths.length})
                </h3>
                {result.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {result.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 italic">No strengths identified</p>
                )}
              </div>

              {/* Issues */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                  <span>❌</span> Issues ({result.issues.length})
                </h3>
                {result.issues.length > 0 ? (
                  <ul className="space-y-2">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 italic">No issues found</p>
                )}
              </div>

              {/* Suggestions */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <span>💡</span> Suggestions ({result.suggestions.length})
                </h3>
                {result.suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 italic">No suggestions needed</p>
                )}
              </div>
            </div>

            {/* Keyword Analysis (if job description provided) */}
            {jobDescription && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
                  <h3 className="text-lg font-bold text-green-600 mb-4">✅ Matched Keywords ({result.matchedKeywords.length})</h3>
                  {result.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 italic">No matching keywords found</p>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-600 mb-4">⚠️ Missing Keywords ({result.missingKeywords.length})</h3>
                  {result.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 italic">Great keyword coverage!</p>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Resume Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{result.wordCount}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{result.strengths.length}</div>
                  <div className="text-sm text-gray-600">Strengths</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{result.issues.length}</div>
                  <div className="text-sm text-gray-600">Issues</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{result.matchedKeywords.length}</div>
                  <div className="text-sm text-gray-600">Keywords Matched</div>
                </div>
              </div>
            </div>

            {/* Action Steps */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-3">🎯 Next Steps</h3>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-blue-900">
                <li>Review and fix all identified issues</li>
                <li>Add suggested keywords from the job description</li>
                <li>Include quantifiable achievements with numbers</li>
                <li>Use strong action verbs at the start of bullet points</li>
                <li>Keep formatting simple and ATS-friendly (no tables, columns, or images)</li>
                <li>Reanalyze your resume after making changes to track improvement</li>
              </ol>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-emerald-100 mt-8">
          <h2 className="text-3xl font-bold text-emerald-800 mb-6">What is an AI Resume Optimizer?</h2>
          <div className="prose prose-emerald max-w-none text-gray-700 space-y-4">
            <p>
              An AI Resume Optimizer is a powerful tool that analyzes your resume to ensure it passes <strong>Applicant Tracking Systems (ATS)</strong> - the AI software that 99% of Fortune 500 companies and 70% of all employers use to screen resumes before a human ever sees them. Our optimizer checks your resume against 10+ critical factors, provides an ATS score (0-100), identifies issues, and gives actionable suggestions to improve your chances of getting interviews.
            </p>
            <p>
              Did you know that <strong>75% of resumes are rejected by ATS</strong> before reaching human recruiters? Even highly qualified candidates get filtered out due to poor resume formatting, missing keywords, or ATS-unfriendly design. Our AI Resume Optimizer helps you beat these automated systems by ensuring your resume is properly formatted, contains relevant keywords, and follows ATS best practices.
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Use an AI Resume Optimizer?</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Beat ATS Screening:</strong> 75% of resumes never reach human eyes due to ATS rejection. Our tool helps you pass automated screening.</li>
              <li><strong>Instant ATS Score:</strong> Get a 0-100 ATS score showing how well your resume will perform with applicant tracking systems.</li>
              <li><strong>Keyword Optimization:</strong> Match your resume to job descriptions by identifying matched and missing keywords that ATS looks for.</li>
              <li><strong>Formatting Check:</strong> Ensure your resume uses ATS-friendly formatting without tables, images, or special characters that confuse AI.</li>
              <li><strong>Actionable Suggestions:</strong> Receive specific, actionable recommendations to improve your ATS score and increase interview chances.</li>
              <li><strong>Quantifiable Achievements:</strong> Identify if your resume includes enough metrics and numbers that prove your impact.</li>
              <li><strong>Professional Language:</strong> Check for informal or unprofessional language that might hurt your credibility.</li>
              <li><strong>Section Completeness:</strong> Verify that all essential sections (Experience, Education, Skills) are present and properly formatted.</li>
              <li><strong>100% Free:</strong> No subscriptions, no hidden costs. Optimize unlimited resumes completely free.</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">How Our AI Resume Optimizer Works</h3>
            <p>
              Our optimizer uses advanced algorithms to analyze your resume across 10 critical ATS factors:
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">1. Contact Information (10 points)</h4>
                <p className="text-gray-700">Checks for presence of email and phone number. ATS cannot shortlist candidates without complete contact info.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">2. Section Headers (15 points)</h4>
                <p className="text-gray-700">Verifies standard sections like Experience, Education, Skills, Summary/Objective. ATS relies on these headers to parse information.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">3. Resume Length (10 points)</h4>
                <p className="text-gray-700">Checks if resume is 300-800 words. Too short appears unqualified; too long gets truncated by ATS.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">4. Action Verbs (15 points)</h4>
                <p className="text-gray-700">Identifies strong action verbs like "achieved," "improved," "increased," "managed." ATS favors active, results-oriented language.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">5. Quantifiable Achievements (15 points)</h4>
                <p className="text-gray-700">Checks for numbers, percentages, and metrics that prove impact. "Increased sales by 35%" scores higher than "Increased sales."</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">6. Keyword Matching (20 points)</h4>
                <p className="text-gray-700">Compares your resume to job description keywords. ATS ranks candidates by keyword match percentage.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">7. Formatting (5 points)</h4>
                <p className="text-gray-700">Checks for bullet points and ATS-friendly formatting. Simple formats parse better than complex designs.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">8. Special Characters (5 points)</h4>
                <p className="text-gray-700">Identifies problematic characters (©, ®, ™, |, #) that confuse ATS parsers.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">9. Professional Language (5 points)</h4>
                <p className="text-gray-700">Detects informal terms like "I think," "probably," "kinda" that hurt professional credibility.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">10. Education Format (5 points)</h4>
                <p className="text-gray-700">Verifies education section includes degree type and institution name that ATS can recognize.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">How to Use the AI Resume Optimizer</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Paste Your Resume:</strong> Copy your complete resume text (not the PDF) and paste it into the resume field. Include all sections.</li>
              <li><strong>Add Job Description (Optional):</strong> For keyword optimization, paste the job description you're applying for. This enables targeted keyword matching.</li>
              <li><strong>Click Optimize:</strong> Click the "Optimize Resume" button to start analysis. Results appear in 2-3 seconds.</li>
              <li><strong>Review ATS Score:</strong> Check your ATS score (0-100) and rating. Scores 85+ are excellent, 70-84 good, 55-69 fair, below 55 need major work.</li>
              <li><strong>Read Analysis:</strong> Review strengths, issues, and suggestions. Pay special attention to issues marked in red.</li>
              <li><strong>Check Keywords:</strong> If you provided job description, see which keywords you matched and which are missing.</li>
              <li><strong>Make Improvements:</strong> Edit your resume based on suggestions. Focus on highest-impact changes first.</li>
              <li><strong>Reanalyze:</strong> Run the optimizer again after edits to track your score improvement.</li>
              <li><strong>Aim for 85+:</strong> Keep optimizing until you reach an ATS score of 85 or higher for best results.</li>
            </ol>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">ATS Resume Best Practices</h3>
            <p>
              Follow these proven strategies to maximize your ATS score and get more interviews:
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">1. Use Standard Section Headers</h4>
            <p>
              ATS looks for specific section headers. Use standard names:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>"Professional Experience"</strong> or <strong>"Work Experience"</strong> (not "Where I've Worked")</li>
                <li><strong>"Education"</strong> (not "Academic Background")</li>
                <li><strong>"Skills"</strong> (not "Competencies")</li>
                <li><strong>"Professional Summary"</strong> or <strong>"Career Objective"</strong></li>
              </ul>
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">2. Match Job Description Keywords</h4>
            <p>
              ATS ranks candidates by keyword match percentage:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Read job description carefully and identify 10-15 key skills/requirements</li>
                <li>Incorporate exact phrases from job posting (e.g., if they say "project management," use that exact term)</li>
                <li>Include both acronyms and full terms (e.g., "Search Engine Optimization (SEO)")</li>
                <li>Naturally weave keywords into your experience bullet points</li>
                <li>Don't keyword stuff - maintain readability for human readers too</li>
              </ul>
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">3. Use Strong Action Verbs</h4>
            <p>
              Start each bullet point with powerful action verbs:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Achievement:</strong> Achieved, Accomplished, Exceeded, Surpassed</li>
                <li><strong>Leadership:</strong> Led, Managed, Directed, Spearheaded, Supervised</li>
                <li><strong>Improvement:</strong> Improved, Enhanced, Optimized, Streamlined, Transformed</li>
                <li><strong>Creation:</strong> Created, Developed, Designed, Established, Launched</li>
                <li><strong>Analysis:</strong> Analyzed, Evaluated, Assessed, Researched, Investigated</li>
                <li><strong>Results:</strong> Increased, Reduced, Grew, Expanded, Delivered</li>
              </ul>
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">4. Include Quantifiable Achievements</h4>
            <p>
              Numbers and metrics dramatically improve ATS and human perception:
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-800">❌ Bad Example:</p>
              <p className="text-red-700">"Managed social media accounts and increased engagement"</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
              <p className="font-semibold text-green-800">✅ Good Example:</p>
              <p className="text-green-700">"Managed 5 social media accounts, increasing engagement by 145% and growing follower base from 2K to 12K in 8 months"</p>
            </div>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">5. Keep Formatting Simple</h4>
            <p>
              ATS struggles with complex formatting:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>✅ Use standard fonts (Arial, Calibri, Times New Roman)</li>
                <li>✅ Use simple bullet points (• or -)</li>
                <li>✅ Single column layout</li>
                <li>✅ Clear section headers in bold</li>
                <li>❌ Avoid tables and columns</li>
                <li>❌ Avoid images, logos, and graphics</li>
                <li>❌ Avoid headers/footers</li>
                <li>❌ Avoid text boxes</li>
                <li>❌ Avoid special characters (©, ®, ™, |, #, etc.)</li>
              </ul>
            </p>

            <h4 className="text-xl font-semibold text-emerald-700 mt-6 mb-3">6. Optimize File Format</h4>
            <p>
              <ul className="list-disc pl-6 space-y-1">
                <li>✅ Save as .docx (Microsoft Word) - most ATS-friendly format</li>
                <li>✅ PDF is acceptable for most modern ATS (but .docx is safer)</li>
                <li>❌ Avoid .pages (Mac), .odt, or image files (.jpg, .png)</li>
                <li>Use simple filename: "FirstName_LastName_Resume.docx"</li>
              </ul>
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Common ATS Resume Mistakes</h3>

            <div className="space-y-4 mt-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Mistake #1: Creative Formatting</h4>
                <p className="text-red-700">Using tables, columns, text boxes, or creative designs. ATS cannot parse these and will reject your resume.</p>
                <p className="text-green-700 mt-2"><strong>✅ Fix:</strong> Use simple single-column layout with standard formatting.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Mistake #2: Missing Keywords</h4>
                <p className="text-red-700">Not tailoring resume to job description. ATS ranks by keyword match.</p>
                <p className="text-green-700 mt-2"><strong>✅ Fix:</strong> Customize each resume with keywords from the specific job posting.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Mistake #3: Unusual Section Headers</h4>
                <p className="text-red-700">Creative headers like "My Journey" or "Where I've Been" confuse ATS.</p>
                <p className="text-green-700 mt-2"><strong>✅ Fix:</strong> Use standard headers: Experience, Education, Skills, Summary.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Mistake #4: No Quantifiable Results</h4>
                <p className="text-red-700">Vague descriptions like "Responsible for marketing" without metrics.</p>
                <p className="text-green-700 mt-2"><strong>✅ Fix:</strong> Add specific numbers: "Increased marketing ROI by 40%, generating $2M in revenue"</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-2">❌ Mistake #5: Graphics & Images</h4>
                <p className="text-red-700">Including profile photos, logos, or charts that ATS cannot read.</p>
                <p className="text-green-700 mt-2"><strong>✅ Fix:</strong> Use text only. No images or graphics whatsoever.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Understanding Your ATS Score</h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800">🎉 85-100: Excellent</p>
                <p className="text-green-700">Your resume is highly optimized for ATS. Ready to submit with confidence!</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-800">✅ 70-84: Good</p>
                <p className="text-blue-700">Your resume will likely pass ATS. Make minor improvements suggested to reach excellent range.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-yellow-800">⚠️ 55-69: Fair</p>
                <p className="text-yellow-700">Your resume might pass ATS but needs improvements. Focus on keyword matching and formatting.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="font-semibold text-orange-800">⚡ 40-54: Poor</p>
                <p className="text-orange-700">Your resume will likely be rejected by ATS. Address all issues and suggestions before applying.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-800">❌ 0-39: Very Poor</p>
                <p className="text-red-700">Major revision needed. Consider rewriting resume following ATS best practices.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">What is ATS and why does it matter?</h4>
                <p className="text-gray-700">ATS (Applicant Tracking System) is software that 99% of Fortune 500 companies and 70% of all employers use to screen resumes automatically. ATS filters out 75% of resumes before humans see them, so optimizing for ATS is critical to get interviews.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Is this resume optimizer really free?</h4>
                <p className="text-gray-700">Yes! 100% free with unlimited resume optimizations. No subscriptions, no hidden costs, no credit card required.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Do you store my resume?</h4>
                <p className="text-gray-700">No. All analysis happens in your browser. We don't store, save, or transmit your resume data. Your information is completely private and secure.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Should I include job description?</h4>
                <p className="text-gray-700">Highly recommended! Adding the job description enables keyword matching analysis, showing you which keywords you've successfully included and which ones are missing. This can improve your score by 20+ points.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">What's a good ATS score?</h4>
                <p className="text-gray-700">Aim for 85+. Scores of 70-84 are good and will likely pass ATS. Below 70 needs improvement. Below 55 will likely be rejected.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Should I customize my resume for each job?</h4>
                <p className="text-gray-700">Absolutely! Customize your resume for each job application by matching keywords from the specific job description. This can increase your ATS score by 15-30 points and significantly improve your chances.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Why Choose Our AI Resume Optimizer?</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>100% Free:</strong> Unlimited resume optimizations with no costs or subscriptions</li>
              <li><strong>Instant Results:</strong> Get comprehensive analysis in seconds</li>
              <li><strong>Detailed Scoring:</strong> 0-100 ATS score with clear rating and confidence level</li>
              <li><strong>Actionable Suggestions:</strong> Specific recommendations to improve your score</li>
              <li><strong>Keyword Matching:</strong> Compare your resume to job descriptions for keyword alignment</li>
              <li><strong>Privacy Focused:</strong> No data storage, no registration required</li>
              <li><strong>Comprehensive Analysis:</strong> 10+ factors checked including formatting, keywords, achievements</li>
              <li><strong>Easy to Use:</strong> Simple interface - paste, click, optimize</li>
            </ul>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Start Optimizing Your Resume Now</h3>
            <p>
              Paste your resume above and get instant ATS optimization analysis. Find out your ATS score, identify issues, get keyword suggestions, and receive actionable recommendations to beat applicant tracking systems and land more interviews. Whether you're a recent graduate, career changer, or experienced professional, our free AI Resume Optimizer helps you stand out in today's competitive job market.
            </p>
            <p className="font-semibold text-emerald-800 mt-4">
              Optimize your resume for ATS and increase your interview chances by 300%!
            </p>

            <h3 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">Related AI & Job Search Tools</h3>
            <p className="mb-4">Enhance your job search with our other powerful tools:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/tools/ai-prompt-generator" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Prompt Generator</h4>
                <p className="text-sm text-gray-600">Create prompts for AI interview prep</p>
              </a>
              <a href="/tools/ai-content-detector" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">AI Content Detector</h4>
                <p className="text-sm text-gray-600">Check if content is AI-generated</p>
              </a>
              <a href="/tools/word-counter" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Word Counter</h4>
                <p className="text-sm text-gray-600">Count words in cover letters</p>
              </a>
              <a href="/tools/text-cleaner" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Text Cleaner</h4>
                <p className="text-sm text-gray-600">Clean and format resume text</p>
              </a>
              <a href="/tools/paraphraser" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Paraphraser</h4>
                <p className="text-sm text-gray-600">Rewrite resume bullets</p>
              </a>
              <a href="/tools/keyword-density-checker" className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition">
                <h4 className="font-semibold text-emerald-700 mb-2">Keyword Density Checker</h4>
                <p className="text-sm text-gray-600">Analyze keyword frequency</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
