import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Prompt Generator API running" });
});

app.post("/generate", async (req, res) => {
  const { category, keyword } = req.body;
  if (!category || !keyword) {
    return res.status(400).json({ error: "category and keyword required" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Generate a detailed ${category} prompt (at least 200 characters) for the topic: ${keyword}`
    });

    res.json({ prompt: response.output_text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
