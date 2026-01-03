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
  const lastFinalRef = useRef(''); // dedupe final text on mobile

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

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = (res[0]?.transcript || '').trim();

        if (!text) continue;

        if (res.isFinal) {
          // ✅ DEDUPE: mobile often repeats the same final line
          // If same final text comes again, ignore it
          if (text === lastFinalRef.current) {
            continue;
          }
          lastFinalRef.current = text;

          final += text + ' ';
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

    // reset dedupe so previous final doesn't block new session
    lastFinalRef.current = '';

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

    // reset dedupe on resume so it doesn't block next phrase
    lastFinalRef.current = '';

    setTimeout(() => safeStart(), 100);
  };

  const handleTranscriptEdit = (e) => {
    setTranscript(e.target.value);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    lastFinalRef.current = '';
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
      </div>
    </Layout>
  );
}