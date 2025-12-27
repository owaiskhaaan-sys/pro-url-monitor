import { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function ContentReadabilityOptimizer() {
  const [content, setContent] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) {
      alert('Please enter some content to analyze');
      return;
    }

    setIsAnalyzing(true);

    // Calculate various metrics
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const characters = content.replace(/\s/g, '').length;
    const syllables = countTotalSyllables(words);

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;

    // Calculate averages
    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllables / wordCount;
    const avgWordsPerParagraph = wordCount / paragraphCount;

    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Flesch-Kincaid Grade Level
    const fleschGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

    // Complex words (3+ syllables)
    const complexWords = words.filter(word => countSyllables(word) >= 3);
    const complexWordPercentage = (complexWords.length / wordCount) * 100;

    // Passive voice detection
    const passiveSentences = detectPassiveVoice(sentences);
    const passivePercentage = (passiveSentences.length / sentenceCount) * 100;

    // Transition words
    const transitionWords = detectTransitionWords(content);
    const transitionPercentage = (transitionWords.length / sentenceCount) * 100;

    // Sentence length variety
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const shortSentences = sentenceLengths.filter(len => len < 10).length;
    const mediumSentences = sentenceLengths.filter(len => len >= 10 && len <= 20).length;
    const longSentences = sentenceLengths.filter(len => len > 20).length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Generate suggestions
    const suggestions = generateSuggestions({
      fleschScore,
      fleschGrade,
      avgWordsPerSentence,
      complexWordPercentage,
      passivePercentage,
      transitionPercentage,
      paragraphCount,
      avgWordsPerParagraph,
      sentenceLengths
    });

    setTimeout(() => {
      setResults({
        wordCount,
        sentenceCount,
        paragraphCount,
        characters,
        syllables,
        avgWordsPerSentence,
        avgSyllablesPerWord,
        avgWordsPerParagraph,
        fleschScore,
        fleschGrade,
        complexWords: complexWords.length,
        complexWordPercentage,
        passiveSentences: passiveSentences.length,
        passivePercentage,
        transitionWords: transitionWords.length,
        transitionPercentage,
        shortSentences,
        mediumSentences,
        longSentences,
        readingTime,
        suggestions
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const countSyllables = (word) => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllableMatches = word.match(/[aeiouy]{1,2}/g);
    return syllableMatches ? syllableMatches.length : 1;
  };

  const countTotalSyllables = (words) => {
    return words.reduce((total, word) => total + countSyllables(word), 0);
  };

  const detectPassiveVoice = (sentences) => {
    const passiveIndicators = [
      /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/i,
      /\b(am|is|are|was|were|be|been|being)\s+\w+en\b/i
    ];
    
    return sentences.filter(sentence => 
      passiveIndicators.some(pattern => pattern.test(sentence))
    );
  };

  const detectTransitionWords = (text) => {
    const transitions = [
      'however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'consequently',
      'additionally', 'meanwhile', 'likewise', 'similarly', 'conversely', 'nonetheless',
      'thus', 'hence', 'accordingly', 'alternatively', 'specifically', 'notably',
      'first', 'second', 'third', 'finally', 'next', 'then', 'also', 'besides',
      'for example', 'for instance', 'in fact', 'in addition', 'as a result',
      'on the other hand', 'in contrast', 'in conclusion'
    ];

    const found = [];
    const lowerText = text.toLowerCase();
    transitions.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        found.push(...matches);
      }
    });
    return found;
  };

  const generateSuggestions = (metrics) => {
    const suggestions = [];

    // Flesch Score suggestions
    if (metrics.fleschScore < 30) {
      suggestions.push({
        type: 'critical',
        category: 'Readability',
        text: 'Your content is very difficult to read. Simplify sentence structure and use shorter words.',
        icon: '🔴'
      });
    } else if (metrics.fleschScore < 50) {
      suggestions.push({
        type: 'warning',
        category: 'Readability',
        text: 'Content is fairly difficult. Consider breaking down complex sentences.',
        icon: '🟡'
      });
    } else if (metrics.fleschScore > 80) {
      suggestions.push({
        type: 'success',
        category: 'Readability',
        text: 'Excellent readability! Your content is easy to understand.',
        icon: '🟢'
      });
    }

    // Sentence length suggestions
    if (metrics.avgWordsPerSentence > 25) {
      suggestions.push({
        type: 'warning',
        category: 'Sentence Length',
        text: `Average sentence length is ${metrics.avgWordsPerSentence.toFixed(1)} words. Aim for 15-20 words per sentence.`,
        icon: '⚠️'
      });
    } else if (metrics.avgWordsPerSentence < 10) {
      suggestions.push({
        type: 'info',
        category: 'Sentence Length',
        text: 'Sentences are very short. Mix in some longer sentences for better flow.',
        icon: 'ℹ️'
      });
    }

    // Complex words suggestions
    if (metrics.complexWordPercentage > 15) {
      suggestions.push({
        type: 'warning',
        category: 'Word Complexity',
        text: `${metrics.complexWordPercentage.toFixed(1)}% complex words. Replace with simpler alternatives when possible.`,
        icon: '📚'
      });
    }

    // Passive voice suggestions
    if (metrics.passivePercentage > 20) {
      suggestions.push({
        type: 'warning',
        category: 'Voice',
        text: `${metrics.passivePercentage.toFixed(1)}% passive voice detected. Use active voice for clearer writing.`,
        icon: '🔄'
      });
    } else if (metrics.passivePercentage < 10) {
      suggestions.push({
        type: 'success',
        category: 'Voice',
        text: 'Great use of active voice! This makes your content more engaging.',
        icon: '✅'
      });
    }

    // Transition words suggestions
    if (metrics.transitionPercentage < 20) {
      suggestions.push({
        type: 'info',
        category: 'Flow',
        text: 'Add more transition words (however, therefore, moreover) to improve content flow.',
        icon: '➡️'
      });
    } else if (metrics.transitionPercentage > 30) {
      suggestions.push({
        type: 'success',
        category: 'Flow',
        text: 'Excellent use of transition words for smooth content flow.',
        icon: '🌊'
      });
    }

    // Paragraph suggestions
    if (metrics.avgWordsPerParagraph > 150) {
      suggestions.push({
        type: 'warning',
        category: 'Paragraphs',
        text: `Average ${metrics.avgWordsPerParagraph.toFixed(0)} words per paragraph. Break into smaller chunks (60-100 words).`,
        icon: '📄'
      });
    }

    // Sentence variety
    const totalSentences = metrics.shortSentences + metrics.mediumSentences + metrics.longSentences;
    const mediumPercentage = (metrics.mediumSentences / totalSentences) * 100;
    
    if (mediumPercentage < 40) {
      suggestions.push({
        type: 'info',
        category: 'Variety',
        text: 'Vary your sentence lengths more for better rhythm and engagement.',
        icon: '🎵'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        category: 'Overall',
        text: 'Your content is well-optimized for readability! Keep up the great work.',
        icon: '🎉'
      });
    }

    return suggestions;
  };

  const getFleschScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFleschScoreLabel = (score) => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const getGradeLevel = (grade) => {
    if (grade < 6) return 'Elementary School';
    if (grade < 9) return 'Middle School';
    if (grade < 13) return 'High School';
    if (grade < 16) return 'College';
    return 'Graduate Level';
  };

  const loadSample = () => {
    const sampleText = `SEO optimization is crucial for improving your website's visibility in search engines. However, many beginners struggle to understand the core concepts. This guide will help you master the fundamentals.

First, focus on keyword research. Identify what your target audience is searching for. Use tools like Google Keyword Planner to find relevant keywords with good search volume.

Next, optimize your content. Include your target keywords naturally throughout your text. Don't stuff keywords, as this can harm your rankings. Instead, write for humans first and search engines second.

Additionally, pay attention to technical SEO. Ensure your website loads quickly, is mobile-friendly, and has a clear site structure. These factors significantly impact your search rankings.

Finally, build quality backlinks. Links from reputable websites signal to search engines that your content is valuable. Focus on creating content that others naturally want to link to.`;
    
    setContent(sampleText);
  };

  return (
    <Layout>
      <Head>
        <title>Content Readability Optimizer - Flesch Score & SEO Analysis | ProURLMonitor</title>
        <meta name="description" content="Analyze and optimize content readability with Flesch Reading Ease score, grade level, passive voice detection, and actionable suggestions for better SEO." />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4 text-center">Content Readability Optimizer</h1>
        <p className="text-gray-600 mb-8 text-center">
          Analyze content readability with Flesch score, grade level, and get actionable suggestions to improve engagement!
        </p>

        <div className="card mb-8">
          {/* Content Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Enter Your Content:</label>
              <button
                onClick={loadSample}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                📝 Load Sample
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article, blog post, or any text content here for comprehensive readability analysis..."
              rows="12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {content.trim().split(/\s+/).filter(w => w.length > 0).length} words • {content.length} characters
              </span>
              <span className="text-xs text-gray-500">
                Minimum 50 words recommended for accurate analysis
              </span>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className={`btn btn-primary px-12 py-3 text-lg ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Readability'}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Readability Scores */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-2 border-emerald-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Readability Scores</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-5 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Flesch Reading Ease</div>
                    <div className={`text-4xl font-bold ${getFleschScoreColor(results.fleschScore)} mb-2`}>
                      {results.fleschScore.toFixed(1)}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {getFleschScoreLabel(results.fleschScore)}
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      Higher scores = Easier to read (0-100 scale)
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Flesch-Kincaid Grade</div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {results.fleschGrade.toFixed(1)}
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {getGradeLevel(results.fleschGrade)}
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      U.S. grade level needed to understand
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm">Reading Ease Guide:</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div>• <strong>90-100:</strong> Very Easy (5th grade) - Simple, conversational</div>
                    <div>• <strong>80-89:</strong> Easy (6th grade) - Casual, everyday language</div>
                    <div>• <strong>70-79:</strong> Fairly Easy (7th grade) - Plain English</div>
                    <div>• <strong>60-69:</strong> Standard (8-9th grade) - Ideal for web content</div>
                    <div>• <strong>50-59:</strong> Fairly Difficult (10-12th grade) - Technical content</div>
                    <div>• <strong>30-49:</strong> Difficult (College) - Academic writing</div>
                    <div>• <strong>0-29:</strong> Very Difficult (Graduate) - Professional/scientific</div>
                  </div>
                </div>
              </div>

              {/* Content Statistics */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Content Statistics</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center shadow">
                    <div className="text-2xl font-bold text-purple-600">{results.wordCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Words</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow">
                    <div className="text-2xl font-bold text-purple-600">{results.sentenceCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Sentences</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow">
                    <div className="text-2xl font-bold text-purple-600">{results.paragraphCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Paragraphs</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow">
                    <div className="text-2xl font-bold text-purple-600">{results.readingTime} min</div>
                    <div className="text-xs text-gray-600 mt-1">Reading Time</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Avg Words/Sentence</div>
                    <div className="text-xl font-bold text-indigo-600">{results.avgWordsPerSentence.toFixed(1)}</div>
                    <div className="text-xs text-gray-500 mt-1">Ideal: 15-20 words</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Avg Syllables/Word</div>
                    <div className="text-xl font-bold text-indigo-600">{results.avgSyllablesPerWord.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">Lower = Simpler</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Avg Words/Paragraph</div>
                    <div className="text-xl font-bold text-indigo-600">{results.avgWordsPerParagraph.toFixed(0)}</div>
                    <div className="text-xs text-gray-500 mt-1">Ideal: 60-100 words</div>
                  </div>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Advanced Metrics</h2>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Complex Words (3+ syllables)</span>
                      <span className="text-lg font-bold text-orange-600">{results.complexWordPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(results.complexWordPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{results.complexWords} complex words found (aim for &lt;15%)</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Passive Voice</span>
                      <span className="text-lg font-bold text-red-600">{results.passivePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(results.passivePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{results.passiveSentences} passive sentences (aim for &lt;20%)</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Transition Words</span>
                      <span className="text-lg font-bold text-green-600">{results.transitionPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(results.transitionPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{results.transitionWords} transition words (aim for 20-30%)</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Sentence Length Distribution</div>
                    <div className="flex gap-2">
                      <div className="flex-1 text-center">
                        <div className="bg-blue-100 p-3 rounded">
                          <div className="text-xl font-bold text-blue-600">{results.shortSentences}</div>
                          <div className="text-xs text-gray-600">Short (&lt;10)</div>
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-green-100 p-3 rounded">
                          <div className="text-xl font-bold text-green-600">{results.mediumSentences}</div>
                          <div className="text-xs text-gray-600">Medium (10-20)</div>
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-orange-100 p-3 rounded">
                          <div className="text-xl font-bold text-orange-600">{results.longSentences}</div>
                          <div className="text-xs text-gray-600">Long (&gt;20)</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">Mix of all three creates better rhythm</div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Optimization Suggestions</h2>
                
                <div className="space-y-3">
                  {results.suggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-l-4 ${
                        suggestion.type === 'critical' ? 'bg-red-50 border-red-500' :
                        suggestion.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        suggestion.type === 'success' ? 'bg-green-50 border-green-500' :
                        'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm mb-1">{suggestion.category}</div>
                          <div className="text-sm text-gray-700">{suggestion.text}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Assessment */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-3">✨ Overall Assessment</h2>
                <div className="text-sm space-y-2">
                  <p>
                    Your content has a <strong>Flesch Reading Ease score of {results.fleschScore.toFixed(1)}</strong>, 
                    making it {getFleschScoreLabel(results.fleschScore).toLowerCase()} to read. 
                    It requires a <strong>{getGradeLevel(results.fleschGrade).toLowerCase()}</strong> reading level.
                  </p>
                  <p>
                    <strong>Reading Time:</strong> {results.readingTime} minute{results.readingTime > 1 ? 's' : ''} • 
                    <strong> Word Count:</strong> {results.wordCount} words • 
                    <strong> Sentences:</strong> {results.sentenceCount}
                  </p>
                  <p className="font-semibold mt-3">
                    {results.fleschScore >= 60 
                      ? '🎉 Great job! Your content is well-optimized for readability.' 
                      : '⚠️ Consider simplifying your content for better engagement.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="prose prose-emerald max-w-none mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">What is Content Readability?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Content readability</strong> refers to how easy it is for readers to understand your text. It's measured using various formulas and metrics, with the most popular being the <strong>Flesch Reading Ease score</strong> and <strong>Flesch-Kincaid Grade Level</strong>. These formulas analyze factors like sentence length, word complexity, and syllable count to determine how accessible your content is to different audiences.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>Flesch Reading Ease score</strong> ranges from 0-100, with higher scores indicating easier-to-read content. A score of 60-70 is considered ideal for most web content, as it's accessible to the average adult reader. The <strong>Flesch-Kincaid Grade Level</strong> indicates the U.S. school grade level needed to comprehend the text. For example, a grade level of 8.0 means an average 8th grader can understand the content.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our <strong>Content Readability Optimizer</strong> goes beyond basic readability scores. It analyzes passive voice usage, transition words, complex word percentage, sentence length variety, and provides actionable suggestions for improvement. Better readability leads to longer time on page, lower bounce rates, and improved SEO performance. For comprehensive content optimization, also use our <a href="/tools/seo-audit" className="text-emerald-600 hover:text-emerald-700 font-medium">SEO Audit Tool</a>.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Readability Matters for SEO</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Readability and SEO</strong> are closely connected:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 User Engagement</h3>
                <p className="text-sm text-gray-700">Easy-to-read content keeps visitors on your page longer, reducing bounce rates and signaling quality to search engines.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Featured Snippets</h3>
                <p className="text-sm text-gray-700">Google prefers clear, concise content for featured snippets. Better readability increases your chances of ranking in position zero.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔊 Voice Search</h3>
                <p className="text-sm text-gray-700">Conversational, easy-to-read content performs better in voice search, which prioritizes natural language.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">📱 Mobile Users</h3>
                <p className="text-sm text-gray-700">Mobile readers prefer scannable, simple content. Poor readability leads to quick exits on mobile devices.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">♿ Accessibility</h3>
                <p className="text-sm text-gray-700">Readable content is more accessible to people with cognitive disabilities and non-native speakers, expanding your audience.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🔄 Dwell Time</h3>
                <p className="text-sm text-gray-700">Clear writing encourages readers to consume more content, increasing dwell time—a key ranking factor.</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Studies show that content with a Flesch score of 60-70 gets 58% more shares on social media and receives 20-30% more backlinks than complex content. Google's algorithms increasingly favor user-friendly content.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">How to Improve Content Readability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Follow these <strong>readability optimization techniques</strong>:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg mb-4">
              <h3 className="font-semibold text-purple-800 mb-3">✍️ Writing Tips:</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Shorten Sentences:</strong> Break long sentences (25+ words) into two shorter ones. Aim for 15-20 words per sentence on average.</li>
                <li><strong>2. Use Simple Words:</strong> Replace complex words with common alternatives. "Use" instead of "utilize," "help" instead of "facilitate."</li>
                <li><strong>3. Choose Active Voice:</strong> "The team completed the project" (active) vs "The project was completed by the team" (passive). Active voice is clearer and more engaging.</li>
                <li><strong>4. Add Transition Words:</strong> Use words like "however," "therefore," "additionally" to connect ideas and improve flow.</li>
                <li><strong>5. Break Up Paragraphs:</strong> Keep paragraphs to 3-5 sentences or 60-100 words. Use white space to improve scannability.</li>
                <li><strong>6. Vary Sentence Length:</strong> Mix short (5-10 words), medium (10-20 words), and long (20-25 words) sentences for rhythm.</li>
                <li><strong>7. Use Subheadings:</strong> Break content into sections with descriptive H2 and H3 headings every 200-300 words.</li>
                <li><strong>8. Include Lists:</strong> Bullet points and numbered lists are easier to scan than dense paragraphs.</li>
                <li><strong>9. Write Conversationally:</strong> Use "you" and "your" to address readers directly. Write like you're speaking to a friend.</li>
                <li><strong>10. Remove Jargon:</strong> Explain technical terms or replace them with simpler language unless writing for experts.</li>
              </ol>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Understanding Flesch Reading Scores</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Flesch Reading Ease Score breakdown</strong> by audience and content type:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Score Range</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Difficulty</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Grade Level</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">90-100</td><td className="border border-gray-300 px-4 py-2 text-sm">Very Easy</td><td className="border border-gray-300 px-4 py-2 text-sm">5th Grade</td><td className="border border-gray-300 px-4 py-2 text-sm">Children's books, simple instructions</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">80-89</td><td className="border border-gray-300 px-4 py-2 text-sm">Easy</td><td className="border border-gray-300 px-4 py-2 text-sm">6th Grade</td><td className="border border-gray-300 px-4 py-2 text-sm">Casual conversation, fiction</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">70-79</td><td className="border border-gray-300 px-4 py-2 text-sm">Fairly Easy</td><td className="border border-gray-300 px-4 py-2 text-sm">7th Grade</td><td className="border border-gray-300 px-4 py-2 text-sm">Mass-market magazines</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">60-69</td><td className="border border-gray-300 px-4 py-2 text-sm">Standard</td><td className="border border-gray-300 px-4 py-2 text-sm">8-9th Grade</td><td className="border border-gray-300 px-4 py-2 text-sm">Web content, blog posts, emails</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">50-59</td><td className="border border-gray-300 px-4 py-2 text-sm">Fairly Difficult</td><td className="border border-gray-300 px-4 py-2 text-sm">10-12th Grade</td><td className="border border-gray-300 px-4 py-2 text-sm">Technical documentation, reports</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-300 px-4 py-2 font-semibold">30-49</td><td className="border border-gray-300 px-4 py-2 text-sm">Difficult</td><td className="border border-gray-300 px-4 py-2 text-sm">College</td><td className="border border-gray-300 px-4 py-2 text-sm">Academic papers, business documents</td></tr>
                  <tr><td className="border border-gray-300 px-4 py-2 font-semibold">0-29</td><td className="border border-gray-300 px-4 py-2 text-sm">Very Difficult</td><td className="border border-gray-300 px-4 py-2 text-sm">Graduate+</td><td className="border border-gray-300 px-4 py-2 text-sm">Scientific journals, legal texts</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-300">
              <h3 className="font-semibold text-green-800 mb-2">🎯 Target Score for Web Content:</h3>
              <p className="text-sm text-gray-700">Aim for a Flesch Reading Ease score of <strong>60-70</strong> for most online content. This ensures your writing is accessible to the broadest audience while maintaining professionalism. News sites like USA Today target 60-70, Time Magazine averages around 50-60.</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Passive Voice vs Active Voice</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding and reducing <strong>passive voice</strong> improves clarity:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">❌ Passive Voice Examples:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>"The blog post <strong>was written by</strong> Sarah."</li>
                  <li>"Mistakes <strong>were made</strong> during the process."</li>
                  <li>"The report <strong>is being reviewed by</strong> the team."</li>
                  <li>"New features <strong>will be added</strong> next month."</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3 italic">Passive voice obscures the doer of the action and feels less direct.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">✅ Active Voice Examples:</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>"Sarah <strong>wrote</strong> the blog post."</li>
                  <li>"We <strong>made</strong> mistakes during the process."</li>
                  <li>"The team <strong>is reviewing</strong> the report."</li>
                  <li>"We <strong>will add</strong> new features next month."</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3 italic">Active voice is clearer, more engaging, and easier to understand.</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 When Passive Voice is OK:</h3>
              <p className="text-sm text-gray-700">Passive voice is acceptable when: (1) the doer is unknown or unimportant ("The building was constructed in 1920"), (2) you want to emphasize the action over the doer ("JavaScript is used by millions of developers"), or (3) in scientific/technical writing where objectivity is required. Aim to keep passive voice below 20% of total sentences.</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Related SEO Tools</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Optimize your content with these complementary tools:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-title-generator" className="hover:text-emerald-600">🏷️ SEO Title Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create engaging, optimized title tags.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/meta-description-generator" className="hover:text-emerald-600">📝 Meta Description Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Generate compelling meta descriptions.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/heading-analyzer" className="hover:text-emerald-600">📑 Heading Analyzer</a>
                </h3>
                <p className="text-sm text-gray-700">Analyze and optimize heading structure.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/word-counter" className="hover:text-emerald-600">📊 Word Counter</a>
                </h3>
                <p className="text-sm text-gray-700">Count words, characters, and analyze text.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/seo-audit" className="hover:text-emerald-600">🔍 SEO Audit</a>
                </h3>
                <p className="text-sm text-gray-700">Comprehensive site SEO analysis.</p>
              </div>
              <div className="border border-emerald-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-emerald-800 mb-2">
                  <a href="/tools/alt-text-generator" className="hover:text-emerald-600">🖼️ Alt Text Generator</a>
                </h3>
                <p className="text-sm text-gray-700">Create accessible image alt text.</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">📚 Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What is a good Flesch Reading Ease score?</h3>
                <p className="text-gray-700 text-sm">A: For web content, aim for 60-70 (8-9th grade level). This makes your content accessible to most readers while maintaining quality. Higher scores (70-80) work for casual blogs, while lower scores (50-60) are acceptable for technical content.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How does readability affect SEO rankings?</h3>
                <p className="text-gray-700 text-sm">A: Better readability improves user engagement metrics (time on page, bounce rate, pages per session), which are ranking signals. Google also uses readability as a quality indicator, especially for featured snippets.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Should I always avoid passive voice?</h3>
                <p className="text-gray-700 text-sm">A: Not always. Aim to keep passive voice below 20%. It's acceptable when the doer is unimportant or in formal writing. Active voice is generally clearer and more engaging.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How many words should my content have for accurate analysis?</h3>
                <p className="text-gray-700 text-sm">A: Minimum 50 words, but 300+ words provide more accurate readability scores. Short content can have skewed metrics.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: What's the ideal sentence length?</h3>
                <p className="text-gray-700 text-sm">A: Aim for 15-20 words per sentence on average. Mix short (5-10), medium (10-20), and occasional long sentences (20-25) for better rhythm and flow.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: How often should I use transition words?</h3>
                <p className="text-gray-700 text-sm">A: Aim for 20-30% of sentences to include transition words (however, therefore, additionally). This improves content flow and helps readers follow your logic.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Can I improve readability without dumbing down my content?</h3>
                <p className="text-gray-700 text-sm">A: Absolutely! Clear writing doesn't mean simple ideas. Use precise language, shorter sentences, and active voice while maintaining depth and sophistication.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Q: Is this readability checker free?</h3>
                <p className="text-gray-700 text-sm">A: Yes! Completely free with unlimited analyses. No registration or payment required. Use it for blog posts, articles, emails, or any content.</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-700 text-white">
            <h2 className="text-2xl font-bold mb-4">🚀 Optimize Your Content Now!</h2>
            <p className="mb-4">
              Use our <strong>free Content Readability Optimizer</strong> to analyze and improve your writing instantly. Get Flesch Reading Ease scores, grade levels, passive voice detection, transition word analysis, and actionable suggestions. Perfect for bloggers, content marketers, copywriters, and SEO professionals.
            </p>
            <p className="mb-4">
              No registration required. Unlimited analyses. Completely free forever!
            </p>
            <p className="font-semibold">
              More tools: <a href="/tools/seo-audit" className="text-purple-100 hover:text-white underline">SEO Audit</a> • <a href="/tools/meta-description-generator" className="text-purple-100 hover:text-white underline">Meta Generator</a> • <a href="/tools/heading-analyzer" className="text-purple-100 hover:text-white underline">Heading Analyzer</a> 🎯
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
