import OpenAI from "openai";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { category, description, detail, random } = req.body;

  if (!category || (!description && !random)) {
    res.status(400).json({ error: "Category and description or random required" });
    return;
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

    res.status(200).json({ prompt: response.output_text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
