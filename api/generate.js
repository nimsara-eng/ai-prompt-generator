import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { category, keyword } = req.body;

  if (!category || !keyword) {
    return res.status(400).json({ error: "category and keyword required" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Generate a detailed ${category} prompt (at least 200 characters) for the topic: ${keyword}`,
    });

    res.status(200).json({ prompt: response.output_text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
