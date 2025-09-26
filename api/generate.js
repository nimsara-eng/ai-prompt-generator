import OpenAI from "openai";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // you can replace * with "http://localhost:8000"
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, description, detail, random } = req.body;

  if (!category || (!description && !random)) {
    return res
      .status(400)
      .json({ error: "Category and description or random required" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const promptText = random
      ? `Generate a random prompt for category: ${category}, detail level: ${detail}`
      : `Generate a detailed ${category} prompt with description: ${description}, detail level: ${detail}`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: promptText,
    });

    return res.status(200).json({ prompt: response.output_text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
