import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const systemPrompt = `You are a helpful AI assistant for ProURLMonitor website. You help users with their questions about:
    - Domain Authority Checker
    - Bulk Domain Age Checker
    - Bulk Domain WHOIS Checker
    - Domain IP History Checker
    - Reverse IP Domain Checker
    - Reverse WHOIS Checker
    - XML & HTML Sitemap Generator
    - Google Malware Checker
    - Bulk Alexa Rank Checker
    - Alexa Rank Comparison
    - Backlinks Maker
    - Social Media Counter
    - Link Search
    - Broken Links Checker
    - Google PageRank Checker
    - Link Extractor
    - Ping Multiple URLs
    - Binary Translator
    
    Be helpful, friendly, and professional. If you cannot answer a question, suggest they contact info@prourlmonitor.com for more help.
    Answer in the same language as the user (Urdu/Hindi/English).`;

    const chat = model.startChat({
      history: [],
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser question: ${message}`);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      reply: "Sorry, I couldn't understand that. Please email us at info@prourlmonitor.com",
    });
  }
}
