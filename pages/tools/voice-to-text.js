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

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      // Stop existing recognition if any
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = (event) => {
        console.log('🎯 Recognition result received!');
        console.log('Event:', event);
        console.log('Results length:', event.results.length);
        console.log('Result index:', event.resultIndex);
        
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          console.log(`Result ${i}:`, {
            text: transcriptText,
            isFinal: event.results[i].isFinal,
            confidence: confidence
          });
          
          if (event.results[i].isFinal) {
            final += transcriptText + ' ';
            console.log('✅ Final text:', transcriptText);
          } else {
            interim += transcriptText;
            console.log('⏳ Interim text:', transcriptText);
          }
        }

        console.log('Setting transcript - Final:', final, 'Interim:', interim);
        
        if (final) {
          setTranscript(prev => {
            const newTranscript = prev + final;
            console.log('📝 Updated transcript:', newTranscript);
            return newTranscript;
          });
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('Microphone access denied. Please allow microphone permission.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          // Don't show error for no-speech, just continue listening
        } else if (event.error === 'aborted') {
          console.log('Recognition aborted');
        } else {
          setError(`Error: ${event.error}`);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        console.log('Recognition ended, isListening:', isListening);
        if (isListening) {
          console.log('Restarting recognition...');
          try {
            recognition.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
          }
        }
      };

      recognitionRef.current = recognition;

      // If already listening, start the new recognition
      if (isListening) {
        try {
          recognition.start();
          console.log('Started new recognition with language:', language);
        } catch (err) {
          console.error('Error starting recognition:', err);
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
    };
  }, [language]);

  const startListening = async () => {
    setError('');
    console.log('Starting listening...');
    
    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      console.log('Microphone permission granted');
      
      setIsListening(true);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            console.log('Recognition started successfully');
          } catch (err) {
            console.error('Error starting recognition:', err);
            setError('Failed to start speech recognition. Please try again.');
          }
        }
      }, 100);
    } catch (err) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permission in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError('Error accessing microphone: ' + err.message);
      }
    }
  };

  const stopListening = () => {
    console.log('Stopping listening...');
    setIsListening(false);
    setIsPaused(false);
    setIsEditing(true);
    setInterimTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Recognition stopped successfully');
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
  };

  const pauseListening = () => {
    console.log('Pausing listening...');
    setIsPaused(true);
    setIsEditing(true);
    setInterimTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Recognition paused successfully');
      } catch (err) {
        console.error('Error pausing recognition:', err);
      }
    }
  };

  const resumeListening = () => {
    console.log('Resuming listening...');
    setIsPaused(false);
    setIsEditing(false);
    setError('');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log('Recognition resumed successfully');
      } catch (err) {
        console.error('Error resuming recognition:', err);
        setError('Failed to resume speech recognition. Please try again.');
      }
    }
  };

  const handleTranscriptEdit = (e) => {
    setTranscript(e.target.value);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
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
        <title>Free Voice to Text Converter Online - Real-Time Speech Recognition 2026</title>
        <meta name="description" content="Convert voice to text instantly with our free online speech-to-text converter. Real-time transcription in 15+ languages including English, Urdu, Hindi, Arabic. No sign-up required, 100% private & secure. Perfect for notes, transcription, dictation & more." />
        <meta name="keywords" content="voice to text, speech to text, voice recognition, transcription tool, audio to text, free voice converter, speech recognition online, dictation software, voice typing, speech transcription, real time transcription" />
        <link rel="canonical" href="https://www.prourlmonitor.com/tools/voice-to-text" />
        
        <meta property="og:title" content="Free Voice to Text Converter Online - Real-Time Speech Recognition 2026" />
        <meta property="og:description" content="Convert voice to text instantly with our free online speech-to-text converter. Real-time transcription in 15+ languages. No sign-up required, 100% private & secure." />
        <meta property="og:url" content="https://www.prourlmonitor.com/tools/voice-to-text" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Voice to Text Converter Online - Real-Time Speech Recognition 2026" />
        <meta name="twitter:description" content="Convert voice to text instantly with our free online speech-to-text converter. Real-time transcription in 15+ languages." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold text-red-700 mb-2">Browser Not Supported</h2>
              <p className="text-red-600">
                Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Language:
                </label>
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

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Start Recording
                  </button>
                ) : (
                  <>
                    {!isPaused ? (
                      <>
                        <button
                          onClick={pauseListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Pause
                        </button>
                        <button
                          onClick={stopListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          </svg>
                          Stop
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={resumeListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Resume
                        </button>
                        <button
                          onClick={stopListening}
                          className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          </svg>
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

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Status Indicator */}
              {isListening && !isPaused && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-green-700 font-semibold">Listening... Speak now</p>
                </div>
              )}

              {/* Paused Indicator */}
              {isPaused && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-700 font-semibold">Recording Paused - You can edit the text below</p>
                </div>
              )}

              {/* Transcript Display */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Transcript:
                  {(isPaused || isEditing) && (
                    <span className="ml-2 text-sm text-blue-600 font-normal">
                      (Editable - Click to edit)
                    </span>
                  )}
                </label>
                {(isPaused || isEditing) && !isListening ? (
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
                      {interimTranscript && (
                        <span className="text-gray-500 italic">{interimTranscript}</span>
                      )}
                      {!transcript && !interimTranscript && (
                        <span className="text-gray-400">Your transcribed text will appear here...</span>
                      )}
                    </p>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
                  <div>
                    Words: {transcript.trim().split(/\s+/).filter(word => word.length > 0).length} | 
                    Characters: {transcript.length}
                    {isListening && !isPaused && <span className="ml-2 text-green-600">● REC</span>}
                    {isPaused && <span className="ml-2 text-yellow-600">⏸ PAUSED</span>}
                  </div>
                  {(isPaused || isEditing) && (
                    <div className="text-blue-600 text-xs">
                      💡 Tip: Edit text, remove mistakes, then click Resume to continue
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {transcript && (
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 min-w-[150px] bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Text
                  </button>
                  <button
                    onClick={downloadText}
                    className="flex-1 min-w-[150px] bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Real-Time Transcription</h3>
              <p className="text-gray-600">See your words appear instantly as you speak with high accuracy.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">15+ Languages</h3>
              <p className="text-gray-600">Support for English, Urdu, Hindi, Arabic, and many more languages.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">100% Private</h3>
              <p className="text-gray-600">All processing happens in your browser. No data is sent to servers.</p>
            </div>
          </div>

          {/* How to Use */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use Voice to Text Converter</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Select Your Language</h3>
                  <p className="text-gray-600">Choose from 15+ supported languages including English, Urdu, and Hindi.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Click Start Recording</h3>
                  <p className="text-gray-600">Allow microphone access when prompted by your browser.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Speak Clearly</h3>
                  <p className="text-gray-600">Start speaking into your microphone. Your speech will be transcribed in real-time.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Copy or Download</h3>
                  <p className="text-gray-600">Use the Copy or Download buttons to save your transcribed text.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Use Our Voice to Text Converter?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Save Time & Increase Productivity
                </h3>
                <p className="text-gray-600">Speaking is 3x faster than typing. Convert your thoughts to text instantly and get more done in less time. Perfect for busy professionals, students, and content creators.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Accessibility & Ease of Use
                </h3>
                <p className="text-gray-600">Ideal for people with typing difficulties, disabilities, or those who prefer voice input. Simple interface makes it easy for anyone to use without technical knowledge.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Multi-Language Support
                </h3>
                <p className="text-gray-600">Work in your native language with support for English, Urdu, Hindi, Arabic, Spanish, French, German, Chinese, Japanese, Korean, and more. Perfect for international users.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Free & No Limits
                </h3>
                <p className="text-gray-600">No registration required, no hidden costs, no word limits. Use it as much as you want, whenever you want. Your privacy is protected - no data collection.</p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Use Cases for Voice to Text</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">📝 Note Taking & Meeting Transcription</h3>
                <p className="text-gray-600">Record lectures, meetings, interviews, or brainstorming sessions. Convert spoken words to written notes instantly without missing any important details. Great for students and professionals.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">✍️ Content Creation & Blogging</h3>
                <p className="text-gray-600">Draft blog posts, articles, social media captions, or video scripts by speaking naturally. Overcome writer's block and create content faster than ever before.</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">📧 Email & Message Drafting</h3>
                <p className="text-gray-600">Compose emails, text messages, and professional communications quickly. Perfect for responding to messages on the go or when you need to send multiple emails.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">📚 Academic Research & Documentation</h3>
                <p className="text-gray-600">Transcribe research notes, interview recordings, or document your findings. Save hours of manual typing and focus on analyzing your research instead.</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">🎯 To-Do Lists & Task Management</h3>
                <p className="text-gray-600">Quickly create task lists, reminders, and project plans by speaking. Capture ideas as they come without breaking your workflow.</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-bold text-gray-800 mb-2">♿ Accessibility & Assistive Technology</h3>
                <p className="text-gray-600">Essential tool for people with mobility issues, carpal tunnel syndrome, dyslexia, or other conditions that make typing difficult. Makes digital communication accessible to everyone.</p>
              </div>
            </div>
          </div>

          {/* Tips for Better Accuracy */}
          <div className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tips for Better Transcription Accuracy</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎤</span>
                  Use a Quality Microphone
                </h3>
                <p className="text-gray-600 mb-4">A good microphone captures clearer audio. Use a headset or external mic for best results, especially in noisy environments.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔇</span>
                  Minimize Background Noise
                </h3>
                <p className="text-gray-600 mb-4">Find a quiet space or use noise-canceling features. Background noise can significantly reduce transcription accuracy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🗣️</span>
                  Speak Clearly & Naturally
                </h3>
                <p className="text-gray-600 mb-4">Enunciate words clearly but maintain a natural pace. Avoid mumbling or speaking too fast. Pause between sentences.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📏</span>
                  Maintain Proper Distance
                </h3>
                <p className="text-gray-600 mb-4">Keep the microphone 6-8 inches from your mouth. Too close can cause distortion, too far reduces clarity.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✏️</span>
                  Use Punctuation Commands
                </h3>
                <p className="text-gray-600 mb-4">Say "period", "comma", "question mark" for punctuation. This improves readability and reduces editing time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  Select Correct Language
                </h3>
                <p className="text-gray-600 mb-4">Always choose the language you're speaking in. Accuracy drops significantly if the wrong language is selected.</p>
              </div>
            </div>
          </div>

          {/* Comparison with Other Tools */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose ProURLMonitor Voice to Text?</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Feature</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">ProURLMonitor</th>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">Other Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Cost</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">100% Free</td>
                    <td className="px-4 py-3 text-center text-gray-600">Often Paid</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Sign-up Required</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">No</td>
                    <td className="px-4 py-3 text-center text-gray-600">Usually Yes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Real-Time Transcription</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">✓ Yes</td>
                    <td className="px-4 py-3 text-center text-gray-600">Limited</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Language Support</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">15+ Languages</td>
                    <td className="px-4 py-3 text-center text-gray-600">Varies</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Privacy</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">100% Private</td>
                    <td className="px-4 py-3 text-center text-gray-600">Data Collection</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Usage Limits</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">Unlimited</td>
                    <td className="px-4 py-3 text-center text-gray-600">Often Limited</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Copy & Download</td>
                    <td className="px-4 py-3 text-center text-green-600 font-semibold">✓ Yes</td>
                    <td className="px-4 py-3 text-center text-gray-600">Premium Only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions About Voice to Text</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Which browsers support voice to text conversion?</h3>
                <p className="text-gray-600">Our voice to text converter works best on Google Chrome, Microsoft Edge, Safari, and Opera browsers. These browsers have built-in support for the Web Speech API. Firefox has limited support. Make sure you're using the latest browser version for optimal performance.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is my voice data stored anywhere or shared with third parties?</h3>
                <p className="text-gray-600">No, your privacy is completely protected. All speech recognition processing happens locally in your browser using built-in APIs. We don't store, record, or transmit any audio or text data to our servers. Your transcribed text only exists in your browser until you close the page.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I use this voice to text tool offline without internet?</h3>
                <p className="text-gray-600">Unfortunately, no. Speech recognition requires an active internet connection because the browser's Web Speech API connects to cloud-based speech recognition services (typically Google's servers) for processing. However, the connection is secure and no data is permanently stored.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How accurate is the voice transcription? What affects accuracy?</h3>
                <p className="text-gray-600">With clear speech and a good microphone, accuracy is typically 90-95%. Factors affecting accuracy include: speech clarity, microphone quality, background noise, accent, speaking pace, and selected language. Follow our tips above for better results. Technical terms or uncommon words may have lower accuracy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What languages are supported for speech recognition?</h3>
                <p className="text-gray-600">We support 15+ languages including English (US/UK), Urdu (Pakistan), Hindi (India), Arabic (Saudi Arabia), Spanish (Spain), French (France), German (Germany), Chinese (Mandarin), Japanese, Korean, Portuguese (Brazil), Russian, Italian, and Turkish. Select your language before recording for best accuracy.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I edit the transcribed text before downloading?</h3>
                <p className="text-gray-600">Yes! The transcribed text appears in an editable area. You can click on it, make corrections, add punctuation, or modify any part of the text before copying or downloading. Changes are made in real-time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is there a time limit for voice recording?</h3>
                <p className="text-gray-600">There's no set time limit. You can record continuously as long as needed. However, we recommend pausing and reviewing your transcription periodically to ensure accuracy. Long sessions may be affected by browser limitations or timeouts.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Do I need to install any software or extensions?</h3>
                <p className="text-gray-600">No installation needed! Our voice to text converter works entirely in your web browser. Just visit the page, allow microphone access when prompted, and start speaking. It's that simple - no downloads, no sign-ups, no hassle.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I use this for transcribing pre-recorded audio files?</h3>
                <p className="text-gray-600">Currently, our tool only works with live microphone input. It cannot process pre-recorded audio files. You would need to play the audio through speakers and use the microphone to capture it, though this may reduce accuracy due to audio quality loss.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How do I add punctuation to my voice transcription?</h3>
                <p className="text-gray-600">While the tool automatically adds some punctuation, you can improve results by saying punctuation commands like "period", "comma", "question mark", "exclamation point", "new line", or "new paragraph". After transcription, you can also manually edit and add punctuation as needed.</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Convert Your Voice to Text?</h2>
            <p className="text-lg mb-6 text-blue-100">Start transcribing instantly - no sign-up required, completely free!</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all shadow-lg"
            >
              Start Converting Now ↑
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
