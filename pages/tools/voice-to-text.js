import { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function VoiceToText() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      // Don't reinitialize if already exists
      if (!recognitionRef.current) {
        // Initialize Speech Recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
          console.log('Recognition started successfully');
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setText((prev) => prev + finalTranscript);
            setInterimText('');
          } else {
            setInterimText(interimTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            console.log('No speech detected. Please try again.');
          } else if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access in your browser settings.');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          console.log('Recognition ended');
          setIsListening(false);
          setInterimText('');
        };

        recognitionRef.current = recognition;
      } else {
        // Just update language if recognition already exists
        recognitionRef.current.lang = language;
      }
    }

    return () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, [language, isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
        console.log('Started listening in language:', language);
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Failed to start voice recognition. Please make sure microphone access is allowed and try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        console.log('Stopped listening');
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
    }
  };

  const clearText = () => {
    setText('');
    setInterimText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'voice-to-text-' + Date.now() + '.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getWordCount = () => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return text.length;
  };

  return (
    <Layout>
      <Head>
        <title>Voice to Text - Speech to Text Converter | ProURLMonitor</title>
        <meta name="description" content="Free voice to text converter. Convert speech to text in real-time using your microphone. Supports multiple languages including English and Urdu." />
        <meta name="keywords" content="voice to text, speech to text, voice recognition, speech recognition, dictation tool, voice typing" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">Voice to Text Converter</h1>
        <p className="text-gray-600 mb-8">Convert your speech to text in real-time using your microphone</p>

        {!isSupported ? (
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-700">
              ❌ Sorry, your browser doesn't support Speech Recognition. Please use Google Chrome, Microsoft Edge, or Safari.
            </p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isListening}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="ur-PK">Urdu (Pakistan)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                    <option value="fr-FR">French (France)</option>
                    <option value="de-DE">German (Germany)</option>
                    <option value="ar-SA">Arabic (Saudi Arabia)</option>
                    <option value="zh-CN">Chinese (Mandarin)</option>
                    <option value="ja-JP">Japanese (Japan)</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  {!isListening ? (
                    <button
                      onClick={startListening}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      🎤 Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                      ⏹️ Stop Recording
                    </button>
                  )}
                </div>
              </div>

              {isListening && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-emerald-700 font-medium">Listening... Speak now</span>
                </div>
              )}
            </div>

            {/* Text Output */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-emerald-700">Transcribed Text</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!text}
                    className="btn btn-secondary btn-sm"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadText}
                    disabled={!text}
                    className="btn btn-secondary btn-sm"
                  >
                    💾 Download
                  </button>
                  <button
                    onClick={clearText}
                    disabled={!text}
                    className="btn bg-red-100 hover:bg-red-200 text-red-700 btn-sm"
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>

              <textarea
                value={text + interimText}
                onChange={(e) => setText(e.target.value)}
                placeholder="Your transcribed text will appear here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-64"
                rows="12"
              />

              <div className="flex gap-6 mt-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Words:</span> {getWordCount()}
                </div>
                <div>
                  <span className="font-medium">Characters:</span> {getCharacterCount()}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-700 mb-2">💡 How to Use:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-900 space-y-1">
                <li>Select your preferred language from the dropdown</li>
                <li>Click "Start Recording" and allow microphone access</li>
                <li>Speak clearly into your microphone</li>
                <li>Your speech will be converted to text in real-time</li>
                <li>Click "Stop Recording" when finished</li>
                <li>Edit the text if needed, then copy or download</li>
              </ol>
              <p className="text-xs text-blue-700 mt-3">
                <strong>Note:</strong> Works best in Chrome and Edge browsers. Requires microphone permission.
              </p>
            </div>
          </>
        )}

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Free Voice to Text Converter - Speech Recognition Tool</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                Need to convert <strong>voice to text</strong> quickly? Our free <strong>speech to text converter</strong> uses advanced browser-based speech recognition technology to transcribe your spoken words into written text instantly. Whether you're dictating emails, writing articles, or taking notes, this <strong>voice typing tool</strong> makes it super easy.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">What is Voice to Text?</h3>
              <p>
                <strong>Voice to text</strong> (also known as <strong>speech to text</strong> or <strong>voice recognition</strong>) is a technology that converts spoken language into written text. It's perfect for anyone who wants to write faster, has difficulty typing, or simply prefers speaking over typing. Our tool uses the Web Speech API built into modern browsers, which means it's completely <strong>free and works offline</strong> once the page is loaded.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Key Features of Our Voice to Text Tool</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Real-time transcription</strong> - See your words appear as you speak</li>
                <li><strong>Multiple languages supported</strong> - English, Urdu, Hindi, Arabic, Spanish, French, German, Chinese, Japanese, and more</li>
                <li><strong>No installation required</strong> - Works directly in your browser</li>
                <li><strong>100% free</strong> - No subscriptions, no hidden fees</li>
                <li><strong>Privacy-focused</strong> - Your voice data isn't stored on our servers</li>
                <li><strong>Edit functionality</strong> - Edit the transcribed text before downloading</li>
                <li><strong>Export options</strong> - Copy to clipboard or download as .txt file</li>
                <li><strong>Word & character counter</strong> - Track your transcription length</li>
              </ul>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">How to Use Voice to Text Converter</h3>
              <p>
                Using our <strong>voice recognition tool</strong> is incredibly simple:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Select your language (we support Urdu, English, Hindi, and 7+ other languages)</li>
                <li>Click the "Start Recording" button</li>
                <li>Allow microphone access when prompted by your browser</li>
                <li>Start speaking clearly - your words will appear in real-time</li>
                <li>Click "Stop Recording" when you're done</li>
                <li>Edit the text if needed, then copy or download it</li>
              </ol>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Best Use Cases for Speech to Text</h3>
              <p>
                Our <strong>dictation tool</strong> is perfect for various scenarios:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Content creation</strong> - Write blog posts, articles, or social media content faster</li>
                <li><strong>Note-taking</strong> - Capture meeting notes, lecture notes, or brainstorming sessions</li>
                <li><strong>Email dictation</strong> - Compose emails hands-free</li>
                <li><strong>Accessibility</strong> - Help users with typing difficulties or disabilities</li>
                <li><strong>Language learning</strong> - Practice pronunciation and see it transcribed</li>
                <li><strong>Transcription</strong> - Convert interviews or recordings to text</li>
                <li><strong>Multi-language support</strong> - Great for bilingual users (English/Urdu/Hindi)</li>
              </ul>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Tips for Better Voice Recognition Accuracy</h3>
              <p>
                To get the best results with our <strong>speech recognition tool</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Speak clearly and at a moderate pace</li>
                <li>Use a good quality microphone (built-in laptop mics work fine)</li>
                <li>Minimize background noise</li>
                <li>Use Chrome or Edge browser for best compatibility</li>
                <li>Say punctuation marks like "period", "comma", "question mark"</li>
                <li>Take brief pauses between sentences</li>
                <li>Select the correct language before starting</li>
              </ul>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Urdu Voice to Text Support</h3>
              <p>
                Our tool supports <strong>Urdu voice recognition</strong> (اردو آواز سے متن)! Pakistani users can easily convert their Urdu speech to text. This is especially useful for:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Writing Urdu content without an Urdu keyboard</li>
                <li>Creating social media posts in Urdu</li>
                <li>Taking notes in your native language</li>
                <li>Communicating more naturally while typing</li>
              </ul>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Browser Compatibility</h3>
              <p>
                This <strong>voice typing tool</strong> works best in:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>✅ Google Chrome (recommended)</li>
                <li>✅ Microsoft Edge</li>
                <li>✅ Safari (limited language support)</li>
                <li>❌ Firefox (limited support)</li>
              </ul>
              <p>
                Make sure to allow microphone access when prompted. The tool uses your browser's built-in speech recognition, so no data is sent to external servers.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Privacy & Security</h3>
              <p>
                Your privacy matters to us. Our <strong>voice to text converter</strong> processes everything locally in your browser using the Web Speech API. We don't store, record, or transmit your voice data to any external servers. Your transcriptions stay on your device unless you choose to download or copy them.
              </p>

              <h3 className="text-xl font-bold text-emerald-600 mt-6 mb-3">Frequently Asked Questions</h3>
              <p>
                <strong>Q: Is this voice to text tool really free?</strong><br />
                A: Yes! 100% free with no limitations or hidden charges.
              </p>
              <p>
                <strong>Q: Do I need to install any software?</strong><br />
                A: No installation needed. It works directly in your web browser.
              </p>
              <p>
                <strong>Q: Can I use this for Urdu speech recognition?</strong><br />
                A: Absolutely! We support Urdu along with 10+ other languages.
              </p>
              <p>
                <strong>Q: Why isn't it working in Firefox?</strong><br />
                A: Firefox has limited Web Speech API support. Please use Chrome or Edge for the best experience.
              </p>
              <p>
                <strong>Q: How accurate is the speech recognition?</strong><br />
                A: Accuracy depends on your pronunciation, microphone quality, and background noise. Generally, it's very accurate for clear speech in supported languages.
              </p>

              <p className="text-lg font-semibold text-emerald-700 mt-6">
                Ready to start voice typing? Click "Start Recording" above and experience the convenience of <strong>hands-free text creation</strong>. Perfect for content creators, students, professionals, and anyone who wants to write faster!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
