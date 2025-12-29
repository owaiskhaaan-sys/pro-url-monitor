import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ROT13Cipher() {
  const [mode, setMode] = useState('rot13');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(13);
  const [preserveCase, setPreserveCase] = useState(true);
  const [preserveNonAlpha, setPreserveNonAlpha] = useState(true);

  const caesarCipher = (text, shiftAmount, preserve = true) => {
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      
      if (/[a-zA-Z]/.test(char)) {
        // Get the character code
        const code = text.charCodeAt(i);
        
        // Uppercase letters (A-Z)
        if (code >= 65 && code <= 90) {
          result += String.fromCharCode(((code - 65 + shiftAmount) % 26 + 26) % 26 + 65);
        }
        // Lowercase letters (a-z)
        else if (code >= 97 && code <= 122) {
          if (preserve) {
            result += String.fromCharCode(((code - 97 + shiftAmount) % 26 + 26) % 26 + 97);
          } else {
            // Convert to uppercase first
            const upper = String.fromCharCode(((code - 97 + shiftAmount) % 26 + 26) % 26 + 65);
            result += upper;
          }
        }
      } else {
        // Non-alphabetic characters
        if (preserveNonAlpha) {
          result += char;
        }
      }
    }
    
    return result;
  };

  const processCipher = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const shiftAmount = mode === 'rot13' ? 13 : parseInt(shift) || 0;
    const result = caesarCipher(input, shiftAmount, preserveCase);
    setOutput(result);
  };

  const decodeCipher = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const shiftAmount = mode === 'rot13' ? 13 : (26 - (parseInt(shift) || 0));
    const result = caesarCipher(input, shiftAmount, preserveCase);
    setOutput(result);
  };

  const bruteForce = () => {
    if (!input.trim()) {
      return;
    }

    let results = '';
    for (let i = 1; i <= 25; i++) {
      const decoded = caesarCipher(input, i, preserveCase);
      results += `Shift ${i}: ${decoded}\n`;
    }
    setOutput(results);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const loadExample = (exampleNum) => {
    const examples = {
      1: { text: 'Hello World', mode: 'rot13' },
      2: { text: 'The quick brown fox jumps over the lazy dog', mode: 'rot13' },
      3: { text: 'ATTACK AT DAWN', mode: 'caesar', shift: 3 },
      4: { text: 'Secret Message 123!', mode: 'caesar', shift: 5 }
    };
    
    const example = examples[exampleNum];
    setInput(example.text);
    setMode(example.mode);
    if (example.shift) setShift(example.shift);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <Layout
      title="ROT13 & Caesar Cipher - Free Online Encoder/Decoder"
      description="Free online ROT13 and Caesar cipher encoder/decoder. Encode and decode messages with customizable shift values. Includes brute force decoder for cryptanalysis."
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ROT13 & Caesar Cipher
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encode and decode text using ROT13 or Caesar cipher with customizable shift values. Perfect for puzzles, educational purposes, and hiding spoilers.
            </p>
          </div>

          {/* Tool Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Cipher Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="rot13"
                    checked={mode === 'rot13'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">ROT13 (Fixed shift of 13)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="caesar"
                    checked={mode === 'caesar'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Caesar Cipher (Custom shift)</span>
                </label>
              </div>
            </div>

            {/* Shift Amount (for Caesar only) */}
            {mode === 'caesar' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Shift Amount (1-25)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={shift}
                    onChange={(e) => setShift(Math.max(1, Math.min(25, parseInt(e.target.value) || 1)))}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Shift: {shift} positions (A → {String.fromCharCode(65 + parseInt(shift))})
                </div>
              </div>
            )}

            {/* Options */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Options
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveCase}
                    onChange={(e) => setPreserveCase(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Preserve letter case</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveNonAlpha}
                    onChange={(e) => setPreserveNonAlpha(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Keep numbers & symbols</span>
                </label>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Input Text
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or decode..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
              <div className="mt-2 text-sm text-gray-600">
                {input.length} characters | {input.replace(/[^a-zA-Z]/g, '').length} letters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={processCipher}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium shadow-lg"
              >
                Encode
              </button>
              <button
                onClick={decodeCipher}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-lg"
              >
                Decode
              </button>
              <button
                onClick={bruteForce}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                🔓 Brute Force (All Shifts)
              </button>
              {output && (
                <button
                  onClick={swapInputOutput}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  ⇄ Swap
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Example Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quick Examples
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => loadExample(1)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm font-medium">
                  ROT13 Simple
                </button>
                <button onClick={() => loadExample(2)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm font-medium">
                  ROT13 Pangram
                </button>
                <button onClick={() => loadExample(3)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm font-medium">
                  Caesar Shift 3
                </button>
                <button onClick={() => loadExample(4)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm font-medium">
                  Caesar Shift 5
                </button>
              </div>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Output
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="text-sm px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <pre className="whitespace-pre-wrap break-words text-gray-900">{output}</pre>
                </div>
              </div>
            )}

            {/* Info Notice */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
              <div className="flex">
                <span className="text-blue-400 mr-3">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">ROT13 is Self-Inverse</h4>
                  <p className="text-sm text-blue-700">
                    ROT13 encoding and decoding use the same operation (shift by 13). Applying ROT13 twice returns the 
                    original text. This makes it perfect for hiding spoilers in forums and emails.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About ROT13 & Caesar Cipher
            </h2>
            
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                The Caesar cipher is one of the oldest and simplest encryption techniques, named after Julius Caesar 
                who used it to protect military messages. ROT13 is a special case of the Caesar cipher with a fixed 
                shift of 13 positions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                How It Works
              </h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-900 mb-2">Caesar Cipher Mechanism</h4>
                <p className="text-sm text-amber-800 mb-3">
                  Each letter in the plaintext is shifted a certain number of positions down the alphabet. 
                  For example, with a shift of 3:
                </p>
                <div className="font-mono text-sm bg-white p-3 rounded space-y-1">
                  <div>Plaintext:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
                  <div>Ciphertext: D E F G H I J K L M N O P Q R S T U V W X Y Z A B C</div>
                  <div className="pt-2">Example: "HELLO" → "KHOOR" (shift 3)</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-900 mb-2">ROT13 Special Properties</h4>
                <p className="text-sm text-amber-800 mb-3">
                  ROT13 shifts by exactly 13 positions, which is half the alphabet (26 letters). This creates a 
                  unique property:
                </p>
                <div className="font-mono text-sm bg-white p-3 rounded space-y-1">
                  <div>A ↔ N    B ↔ O    C ↔ P    D ↔ Q</div>
                  <div>E ↔ R    F ↔ S    G ↔ T    H ↔ U</div>
                  <div>I ↔ V    J ↔ W    K ↔ X    L ↔ Y</div>
                  <div>M ↔ Z</div>
                  <div className="pt-2">ROT13(ROT13(text)) = text (self-inverse)</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Shift Examples
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Shift</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Plaintext</th>
                      <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Ciphertext</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">1</td>
                      <td className="border border-gray-200 px-4 py-2">Caesar Shift 1</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">HELLO</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">IFMMP</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">3</td>
                      <td className="border border-gray-200 px-4 py-2">Classic Caesar</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">HELLO</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">KHOOR</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">5</td>
                      <td className="border border-gray-200 px-4 py-2">Caesar Shift 5</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">HELLO</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">MJQQT</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">13</td>
                      <td className="border border-gray-200 px-4 py-2">ROT13</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">HELLO</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">URYYB</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2">25</td>
                      <td className="border border-gray-200 px-4 py-2">Caesar Shift 25</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">HELLO</td>
                      <td className="border border-gray-200 px-4 py-2 font-mono">GDKKN</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Common Use Cases
              </h3>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Spoiler Protection:</strong> Hide movie/book spoilers in online forums and discussions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Educational:</strong> Teaching basic cryptography and encryption concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Puzzles & Games:</strong> Creating word puzzles, escape rooms, treasure hunts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Email Obfuscation:</strong> Simple obfuscation for non-sensitive data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Historical Study:</strong> Understanding ancient encryption methods</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span><strong>Geocaching:</strong> Encoding hints and clues in outdoor treasure hunts</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Security Analysis
              </h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Not Secure for Real Data</h4>
                <p className="text-sm text-red-700 mb-2">
                  Caesar cipher and ROT13 provide <strong>NO real security</strong>. They are easily broken using:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• <strong>Brute Force:</strong> Only 25 possible shifts to try</li>
                  <li>• <strong>Frequency Analysis:</strong> Letter frequency patterns remain</li>
                  <li>• <strong>Known Plaintext:</strong> Any known word reveals the shift</li>
                  <li>• <strong>Automated Tools:</strong> Can crack instantly</li>
                </ul>
                <p className="text-sm text-red-700 mt-2">
                  <strong>Never use for passwords, sensitive data, or real security needs!</strong>
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-2">✓ Appropriate Uses</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Educational demonstrations of basic cryptography</li>
                  <li>• Hiding spoilers (not protecting secrets)</li>
                  <li>• Recreational puzzles and games</li>
                  <li>• Simple obfuscation (not encryption)</li>
                  <li>• Historical cryptography study</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Breaking Caesar Cipher
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Method 1: Brute Force</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Try all 25 possible shifts. One will make sense as readable text.
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded">
                    Time: Seconds | Success Rate: 100%
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Method 2: Frequency Analysis</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    In English, 'E' is the most common letter (~12.7%). Find the most common letter in ciphertext, 
                    calculate shift to 'E'.
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded">
                    Common letters: E, T, A, O, I, N | Rare: Q, X, Z
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Method 3: Known Plaintext</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    If you know any word in the plaintext, compare it to the ciphertext to find the shift.
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded">
                    Example: "THE" → "WKH" means shift = 3
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Historical Context
              </h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Julius Caesar (100-44 BC)</h4>
                  <p className="text-sm">
                    Julius Caesar used a shift of 3 to communicate with his generals. According to Suetonius, 
                    Caesar "shifted the alphabet three places" when writing confidential messages. While not 
                    secure even in ancient times, it was effective against illiterate enemies.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">ROT13 Origin (1980s)</h4>
                  <p className="text-sm">
                    ROT13 was developed in the early 1980s for Usenet newsgroups. It became the standard way to 
                    hide spoilers, offensive jokes, and puzzle solutions. The name "ROT13" comes from "rotate by 
                    13 places."
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Modern Usage</h4>
                  <p className="text-sm">
                    Today, Caesar cipher and ROT13 are used primarily for education and recreation. They teach 
                    fundamental cryptographic concepts like substitution ciphers, frequency analysis, and the 
                    importance of key space size.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Is ROT13 encryption secure?</h4>
                  <p>
                    No, ROT13 is not secure encryption. It's trivially easy to decode - you can try all 25 shifts 
                    in seconds. ROT13 is obfuscation, not encryption. Use it for hiding spoilers, not protecting 
                    sensitive data.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why does ROT13 work twice to decode?</h4>
                  <p>
                    Because 13 is exactly half of 26 (the alphabet size). Shifting 13 positions twice equals 26, 
                    which wraps back to the original position. This makes ROT13 "self-inverse" - the same operation 
                    encodes and decodes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What shift did Julius Caesar actually use?</h4>
                  <p>
                    According to historical records, Julius Caesar typically used a shift of 3 (A→D, B→E, C→F, etc.). 
                    This is sometimes called the "classical Caesar cipher." However, he may have varied the shift 
                    depending on the recipient.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can Caesar cipher work with numbers and symbols?</h4>
                  <p>
                    The traditional Caesar cipher only shifts letters (A-Z). Numbers and symbols are typically left 
                    unchanged. However, you can extend the concept to include other characters by defining a custom 
                    alphabet that includes them.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I crack a Caesar cipher without tools?</h4>
                  <p>
                    Look for common short words like "THE", "AND", or "TO". Try shifting the ciphertext to match 
                    these words. Alternatively, find the most frequent letter (likely 'E' in English) and calculate 
                    the shift from there. With practice, you can crack simple Caesar ciphers mentally.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's better than Caesar cipher for real security?</h4>
                  <p>
                    For actual security, use modern encryption like AES-256, RSA, or authenticated encryption schemes. 
                    For passwords, use bcrypt or Argon2. Caesar cipher is educational only - it was broken by 
                    frequency analysis over 1,000 years ago by Arab mathematicians.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
