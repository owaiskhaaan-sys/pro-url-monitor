export default function handler(req, res) {
  res.status(200).json({
    message: "ProURLMonitor API - Documentation",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/check-url",
        method: "GET",
        description: "Check HTTP status code of a URL",
        params: "url (required)"
      },
      {
        path: "/api/fetch-page",
        method: "GET",
        description: "Fetch HTML content of a webpage",
        params: "url (required)"
      },
      {
        path: "/api/crawl-sitemap",
        method: "POST",
        description: "Crawl and analyze website sitemap",
        params: "url (required)"
      },
      {
        path: "/api/pagespeed",
        method: "GET",
        description: "Get PageSpeed insights for a URL",
        params: "url (required)"
      },
      {
        path: "/api/chat",
        method: "POST",
        description: "AI chatbot endpoint",
        params: "message (required)"
      },
      {
        path: "/api/auth/login",
        method: "POST",
        description: "User login",
        params: "email, password"
      },
      {
        path: "/api/auth/signup",
        method: "POST",
        description: "User registration",
        params: "email, password, name"
      },
      {
        path: "/api/urls/submit",
        method: "POST",
        description: "Submit URL for monitoring",
        params: "url, email"
      }
    ],
    documentation: "https://www.prourlmonitor.com/docs",
    support: "contact@prourlmonitor.com"
  });
}
