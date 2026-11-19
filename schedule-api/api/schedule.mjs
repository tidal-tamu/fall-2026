const HARP_URL = "https://portal.tidaltamu.com/v1/public/schedule";
const allowedOrigins = new Set([
  "https://f26.tidaltamu.com",
  "http://localhost:5173",
]);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  res.setHeader("Vary", "Origin");

  if (allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET to retrieve the schedule." });
  }

  const apiKey = process.env.HARP_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Harp API key is missing." });
  }

  try {
    const response = await fetch(HARP_URL, {
      headers: { "X-API-Key": apiKey },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("Harp schedule request returned HTTP", response.status);
      return res.status(502).json({ error: "Could not load the schedule." });
    }

    const body = await response.json();
    const events = body.data?.schedule;

    if (!Array.isArray(events)) {
      return res.status(502).json({ error: "Unexpected schedule format." });
    }

    return res.status(200).json({ events });
  } catch {
    return res.status(502).json({ error: "Harp schedule is unavailable." });
  }
}