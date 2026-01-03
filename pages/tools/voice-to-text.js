import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function VoiceToText() {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // refs to avoid stale state + duplicates
  const isListeningRef = useRef(false);
  const isPausedRef = useRef(false);
  const startedRef = useRef(false);
  const processedIndexRef = useRef(0); // track which results we've already processed

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const safeStart = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (startedRef.current) return;

    try {
      startedRef.current = true;
      rec.start();
      // If start succeeds, browser will keep it running; we unlock in onstart/onend
    } catch (e) {
      // InvalidStateError can happen if already started
      startedRef.current = false;
      console.log('safeStart error (ignored):', e?.name || e);
    }
  };

  const safeStop = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch (e) {
      console.log('safeStop error (ignored):', e?.name || e);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // cleanup old recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      startedRef.current = false; // unlock safeStart
      setError('');
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      // Mobile fix: Only process NEW results, not all results from beginning
      const startIndex = Math.max(event.resultIndex, processedIndexRef.current);

      for (let i = startIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = (res[0]?.transcript || '').trim();

        if (!text) continue;

        if (res.isFinal) {
          // Mark this index as processed to avoid reprocessing
          if (i >= processedIndexRef.current) {
            final += text + ' ';
            processedIndexRef.current = i + 1;
          }
        } else {
          interim += text + ' ';
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError('Microphone access denied. Please allow microphone permission.');
        setIsListening(false);
        setIsPaused(false);
        isListeningRef.current = false;
        isPausedRef.current = false;
        return;
      }

      if (event.error === 'no-speech') {
        // normal on mobile; let onend handle restart if needed
        return;
      }

      setError(`Error: ${event.error}`);
      setIsListening(false);
      setIsPaused(false);
      isListeningRef.current = false;
      isPausedRef.current = false;
    };

    recognition.onend = () => {
      startedRef.current = false; // unlock safeStart
      console.log('Recognition ended. listening:', isListeningRef.current, 'paused:', isPausedRef.current);

      // Restart only if still listening AND not paused
      if (isListeningRef.current && !isPausedRef.current) {
        // Reset processed index when restarting
        processedIndexRef.current = 0;
        setTimeout(() => {
          safeStart();
        }, 250);
      }
    };

    recognitionRef.current = recognition;

    // if user is already listening and language changes, restart
    if (isListeningRef.current && !isPausedRef.current) {
      setTimeout(() => safeStart(), 200);
    }

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [language]);

  const startListening = async () => {
    setError('');
    setIsEditing(false);
    setIsPaused(false);
    isPausedRef.current = false;

    // reset processed index for new session
    processedIndexRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      setIsListening(true);
      isListeningRef.current = true;

      setTimeout(() => safeStart(), 50);
    } catch (err) {
      console.error('Microphone error:', err);
      if (err?.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permission in your browser settings.');
      } else if (err?.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Error accessing microphone: ' + (err?.message || 'Unknown'));
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setIsPaused(false);
    setIsEditing(true);
    isListeningRef.current = false;
    isPausedRef.current = false;

    setInterimTranscript('');
    safeStop();
  };

  const pauseListening = () => {
    setIsPaused(true);
    setIsEditing(true);
    isPausedRef.current = true;

    setInterimTranscript('');
    safeStop();
  };

  const resumeListening = () => {
    setIsPaused(false);
    setIsEditing(false);
    setError('');
    isPausedRef.current = false;

    // reset processed index on resume
    processedIndexRef.current = 0;

    setTimeout(() => safeStart(), 100);
  };

  const handleTranscriptEdit = (e) => {
    setTranscript(e.target.value);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    processedIndexRef.current = 0;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert('Text copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ur-PK', name: 'Urdu (Pakistan)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'de-DE', name: 'German (Germany)' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'tr-TR', name: 'Turkish' }
  ];

  return (
    <Layout>
      <Head>
        <title>Free Voice to Text Converter Online - | ProURLMonitor</title>
        <meta
          name="description"
          content="Convert voice to text instantly with our free online speech-to-text converter. Real-time transcription in 15+ languages including English, Urdu, Hindi,..."
        />
        <meta
          name="keywords"
          content="voice to text, speech to text, voice recognition, transcription tool, audio to text, free voice converter"
        />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/voice-to-text" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Voice to Text Converter
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Convert your speech to text in real-time. Supports 15+ languages with high accuracy transcription.
            </p>
          </div>

          {!isSupported ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-red-700 mb-2">Browser Not Supported</h2>
              <p className="text-red-600">
                Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Select Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isListening}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Recording
                  </button>
                ) : (
                  <>
                    {!isPaused ? (
                      <>
                        <button
                          onClick={pauseListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Pause
                        </button>
                        <button
                          onClick={stopListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Stop
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={resumeListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Resume
                        </button>
                        <button
                          onClick={stopListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Stop
                        </button>
                      </>
                    )}
                  </>
                )}

                <button
                  onClick={clearTranscript}
                  disabled={!transcript && !interimTranscript}
                  className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Transcript:
                  {(isPaused || (!isListening && isEditing)) && (
                    <span className="ml-2 text-sm text-blue-600 font-normal">(Editable)</span>
                  )}
                </label>

                {(isPaused || (!isListening && isEditing)) ? (
                  <textarea
                    ref={textareaRef}
                    value={transcript}
                    onChange={handleTranscriptEdit}
                    className="w-full min-h-[300px] max-h-[500px] p-4 border-2 border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 leading-relaxed resize-y"
                    placeholder="Your transcribed text will appear here..."
                  />
                ) : (
                  <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {transcript}
                      {interimTranscript && <span className="text-gray-500 italic"> {interimTranscript}</span>}
                      {!transcript && !interimTranscript && (
                        <span className="text-gray-400">Your transcribed text will appear here...</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {transcript && (
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 min-w-[150px] bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={downloadText}
                    className="flex-1 min-w-[150px] bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comprehensive Content Section */}
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
          {/* How to Use */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use Voice to Text Converter</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Converting your voice to text has never been easier. Our free speech-to-text tool works directly in your browser without requiring any downloads or installations. Here's how to get started:
              </p>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li><strong>Select Your Language:</strong> Choose from 15+ supported languages including English, Urdu, Hindi, Spanish, French, Arabic, Chinese, and more. The tool automatically adjusts to your selected language's accent and pronunciation patterns.</li>
                <li><strong>Grant Microphone Access:</strong> Click the "Start Listening" button and allow microphone access when prompted. This is required for the tool to capture your voice input.</li>
                <li><strong>Start Speaking:</strong> Speak clearly and naturally. The tool will transcribe your speech in real-time, showing both interim (gray) and final (black) text as you speak.</li>
                <li><strong>Pause When Needed:</strong> Need to think or take a break? Hit "Pause" to temporarily stop transcription. Your existing text is preserved and becomes editable. Click "Resume" to continue where you left off.</li>
                <li><strong>Edit Your Text:</strong> When paused or after stopping, you can manually edit the transcript to fix any recognition errors or add punctuation.</li>
                <li><strong>Copy or Download:</strong> Once finished, use the "Copy Text" button to copy to clipboard, or "Download" to save as a .txt file on your device.</li>
              </ol>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Pro Tip:</strong> For best accuracy, speak in a quiet environment with minimal background noise. Position your microphone 6-12 inches from your mouth and speak at a normal conversational pace.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features of Our Voice to Text Tool</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">🎤 Real-Time Transcription</h3>
                <p className="text-gray-700 text-sm">See your words appear instantly as you speak. The tool displays interim results (in progress) and finalizes them automatically, giving you immediate feedback on accuracy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">🌍 15+ Languages Supported</h3>
                <p className="text-gray-700 text-sm">Transcribe in English (US/UK), Urdu, Hindi, Spanish, French, German, Arabic, Chinese, Japanese, Korean, Portuguese, Russian, Italian, Dutch, and Turkish.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">⏸️ Pause & Resume</h3>
                <p className="text-gray-700 text-sm">Unique pause functionality lets you stop recording while keeping your transcript intact. Perfect for collecting your thoughts or handling interruptions without losing work.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">✏️ Manual Editing</h3>
                <p className="text-gray-700 text-sm">Edit your transcript directly in the tool. Fix recognition errors, add punctuation, or refine your text before copying or downloading.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">📱 Mobile Optimized</h3>
                <p className="text-gray-700 text-sm">Works perfectly on smartphones and tablets. Our advanced processing prevents duplicate text issues common in mobile browsers, ensuring clean, accurate transcripts.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">🔒 100% Private</h3>
                <p className="text-gray-700 text-sm">All processing happens in your browser using Web Speech API. Your voice and text never leave your device or get stored on our servers. Complete privacy guaranteed.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">💾 Export Options</h3>
                <p className="text-gray-700 text-sm">Copy transcribed text to clipboard with one click, or download as a .txt file for use in documents, emails, or other applications.</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600 mb-2">🆓 Completely Free</h3>
                <p className="text-gray-700 text-sm">No registration, no subscription, no hidden fees. Unlimited transcription for personal and commercial use without any restrictions.</p>
              </div>
            </div>
          </div>

          {/* Why Use Voice to Text */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Use Voice to Text Technology?</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Voice-to-text technology is revolutionizing how we create written content. Whether you're a professional writer, student, business person, or someone who simply types slowly, speech recognition offers significant advantages:
              </p>
              
              <h3 className="text-lg font-semibold text-emerald-600 mt-6">⚡ Speed and Efficiency</h3>
              <p>
                The average person speaks at 150-160 words per minute but types only 40-50 words per minute. That means you can create written content 3-4x faster using voice dictation. For lengthy documents, emails, reports, or articles, this time savings is massive.
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">♿ Accessibility</h3>
              <p>
                Voice typing is essential for people with physical disabilities, repetitive strain injuries (RSI), carpal tunnel syndrome, or conditions that make traditional typing difficult or painful. It provides equal access to digital communication and content creation.
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">🎯 Hands-Free Operation</h3>
              <p>
                Need to write while cooking, driving, walking, or doing other tasks? Voice-to-text lets you be productive in situations where typing isn't possible. Perfect for busy professionals who want to draft emails during their commute or capture ideas while exercising.
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">🧠 Better for Creative Flow</h3>
              <p>
                Many writers find that speaking their thoughts feels more natural than typing. It can help overcome writer's block because you're having a conversation rather than staring at a blank page. The continuous flow of speech can unlock creativity in ways that typing sometimes restricts.
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">📝 Note-Taking and Meetings</h3>
              <p>
                Capture meeting notes, lecture content, interviews, or brainstorming sessions in real-time. Much faster than manual note-taking and ensures you don't miss important details while trying to write everything down.
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">💼 Professional Applications</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Content Creators:</strong> Draft blog posts, social media content, video scripts, and articles faster</li>
                <li><strong>Medical Professionals:</strong> Dictate patient notes and medical reports hands-free</li>
                <li><strong>Legal Professionals:</strong> Transcribe case notes, client meetings, and dictate legal documents</li>
                <li><strong>Journalists:</strong> Record and transcribe interviews, field notes, and article drafts</li>
                <li><strong>Students:</strong> Take lecture notes, draft essays, and create study guides efficiently</li>
                <li><strong>Business:</strong> Draft emails, create reports, and document processes quickly</li>
              </ul>
            </div>
          </div>

          {/* Best Practices */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Best Practices for Accurate Voice Transcription</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                While modern speech recognition is highly accurate, following these best practices will significantly improve your results:
              </p>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">🎙️ Microphone and Environment</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Use a quality microphone:</strong> Built-in laptop/phone mics work, but an external USB or headset mic provides better clarity</li>
                <li><strong>Minimize background noise:</strong> Find a quiet space. Turn off fans, music, TV, and close windows if there's traffic noise</li>
                <li><strong>Proper distance:</strong> Position your microphone 6-12 inches from your mouth. Too close causes distortion; too far reduces accuracy</li>
                <li><strong>Consistent volume:</strong> Speak at a normal conversational volume. Don't whisper or shout</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">🗣️ Speaking Technique</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Speak clearly and naturally:</strong> Don't over-enunciate or speak robotically. Use your normal speaking voice</li>
                <li><strong>Pace yourself:</strong> Speak at a moderate pace. Not too fast (recognition can't keep up) or too slow (sounds unnatural)</li>
                <li><strong>Pause between sentences:</strong> Brief pauses help the tool recognize sentence boundaries</li>
                <li><strong>Articulate clearly:</strong> Open your mouth fully when speaking and pronounce words completely</li>
                <li><strong>Say punctuation commands:</strong> In most languages, you can say "period", "comma", "question mark", "exclamation point" to add punctuation (Note: Effectiveness varies by language)</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">📱 Technical Tips</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Use supported browsers:</strong> Chrome, Edge, and Safari work best. Firefox support varies</li>
                <li><strong>Grant permanent microphone access:</strong> Click "Always allow" when prompted to avoid repeated permission requests</li>
                <li><strong>Check language settings:</strong> Ensure you've selected the correct language matching what you're speaking</li>
                <li><strong>Stable internet connection:</strong> While processing is local, initial API loading requires internet</li>
                <li><strong>Mobile users:</strong> Our tool prevents duplicate text issues. If you encounter problems, try using Chrome mobile browser</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-600 mt-6">✏️ Post-Transcription Editing</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Always review:</strong> Even 95% accuracy means errors every 20 words. Quick proofread catches mistakes</li>
                <li><strong>Add punctuation:</strong> Voice recognition sometimes misses punctuation. Add periods, commas, and capitals during editing</li>
                <li><strong>Fix homophones:</strong> Words like "there/their/they're" or "to/too/two" may need correction</li>
                <li><strong>Format properly:</strong> Add paragraph breaks, headings, and formatting after transcription</li>
              </ul>
            </div>
          </div>

          {/* Common Use Cases */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Use Cases for Voice to Text</h2>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📧 Email Drafting</h4>
                  <p className="text-sm">Compose professional emails 3x faster. Especially useful for lengthy emails or when responding to multiple messages.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📄 Document Creation</h4>
                  <p className="text-sm">Draft reports, proposals, articles, and essays. Great for getting initial thoughts down quickly before refining.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📝 Meeting Notes</h4>
                  <p className="text-sm">Capture meeting discussions, action items, and decisions in real-time without missing important details.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎓 Lecture Transcription</h4>
                  <p className="text-sm">Students can transcribe professors' lectures for study notes. Review and edit later for better retention.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Social Media Content</h4>
                  <p className="text-sm">Create Facebook posts, Twitter threads, LinkedIn articles, and Instagram captions by speaking naturally.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎬 Video Scripts</h4>
                  <p className="text-sm">YouTubers and content creators can draft video scripts by speaking through their content flow naturally.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📚 Book Writing</h4>
                  <p className="text-sm">Authors can dictate chapters, scenes, and ideas. Some write entire novels using voice-to-text technology.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💭 Brainstorming</h4>
                  <p className="text-sm">Capture spontaneous ideas, creative thoughts, and project plans as they come to you throughout the day.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🏥 Medical Documentation</h4>
                  <p className="text-sm">Healthcare professionals can dictate patient notes, treatment plans, and observations hands-free.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⚖️ Legal Transcription</h4>
                  <p className="text-sm">Lawyers and legal assistants can transcribe case notes, client interviews, and legal briefs efficiently.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎤 Interview Transcription</h4>
                  <p className="text-sm">Journalists, podcasters, and researchers can transcribe interview recordings or dictate interview summaries.</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🌐 Translation Preparation</h4>
                  <p className="text-sm">Speak in your native language to transcribe, then use translation tools to convert to other languages.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Troubleshooting Common Issues</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">❌ Tool not working / "Not Supported" message</h4>
                <p className="text-sm mb-2"><strong>Solution:</strong> Your browser may not support Web Speech API. Try:</p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>Use Chrome, Edge, or Safari (best compatibility)</li>
                  <li>Update your browser to the latest version</li>
                  <li>Enable JavaScript in browser settings</li>
                  <li>Try on a different device</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎤 Microphone not working</h4>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>Click the microphone icon in your browser's address bar and allow access</li>
                  <li>Check system settings to ensure microphone is enabled</li>
                  <li>Make sure no other app is using the microphone</li>
                  <li>Try unplugging and replugging external microphones</li>
                  <li>Restart your browser</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Poor accuracy / Many errors</h4>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>Reduce background noise</li>
                  <li>Speak more clearly and at a moderate pace</li>
                  <li>Check if you've selected the correct language</li>
                  <li>Move closer to the microphone (but not too close)</li>
                  <li>Use a better quality microphone</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🔄 Recognition stops automatically</h4>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>This is normal after periods of silence. Just click Resume or Start again</li>
                  <li>Some browsers have timeouts after 60 seconds of silence</li>
                  <li>Keep speaking to maintain active recognition</li>
                  <li>Use Pause if you need a deliberate break</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📱 Duplicate text on mobile</h4>
                <p className="text-sm mb-2"><strong>Solution:</strong></p>
                <ul className="list-disc list-inside text-sm ml-4 space-y-1">
                  <li>Our tool has advanced processing to prevent this issue</li>
                  <li>If it still occurs, try using Chrome mobile browser</li>
                  <li>Clear browser cache and reload the page</li>
                  <li>Make sure you're using the latest version of the tool</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Text & Content Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/tools/case-converter" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">Case Converter</h3>
                <p className="text-sm text-gray-600">Convert transcribed text to UPPERCASE, lowercase, Title Case, and more</p>
              </a>
              <a href="/tools/word-counter" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">Word Counter</h3>
                <p className="text-sm text-gray-600">Count words, characters, sentences, and paragraphs in your transcript</p>
              </a>
              <a href="/tools/text-to-slug" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">Text to Slug</h3>
                <p className="text-sm text-gray-600">Convert transcribed text to URL-friendly slugs</p>
              </a>
              <a href="/tools/remove-duplicate-lines" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">Remove Duplicates</h3>
                <p className="text-sm text-gray-600">Clean up duplicate lines in your transcribed text</p>
              </a>
              <a href="/tools/find-and-replace" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">Find & Replace</h3>
                <p className="text-sm text-gray-600">Quickly find and replace words in your transcript</p>
              </a>
              <a href="/tools/ai-text-humanizer" className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-lg transition-all">
                <h3 className="font-semibold text-emerald-600 mb-2">AI Text Humanizer</h3>
                <p className="text-sm text-gray-600">Make your transcribed text sound more natural and human</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}