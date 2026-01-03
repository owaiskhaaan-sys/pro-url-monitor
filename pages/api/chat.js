import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  // Use a SERVER-ONLY env var (do NOT use NEXT_PUBLIC_ for secrets)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return res.status(500).json({
      reply:
        "Sorry, chatbot is temporarily unavailable. Please email us at info@prourlmonitor.com",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ Use a supported model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const chat = model.startChat({ history: [] });

    const result = await chat.sendMessage(
      `${systemPrompt}\n\nUser question: ${message}`
    );

    const text = result.response.text();
    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      reply:
        "Sorry, chatbot is temporarily unavailable. Please email us at info@prourlmonitor.com",
    });
  }
}