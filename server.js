const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MediCheck backend is running (Groq)");
});

app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY in .env (restart server after adding it)."
      });
    }

    const {
      model = "llama-3.1-70b-versatile",
      max_tokens = 800,
      system = "",
      messages = []
    } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "`messages` must be an array" });
    }

    // Convert your {role, content} messages into OpenAI-style,
    // and inject system as the first message.
    const groqMessages = [
      ...(system ? [{ role: "system", content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: groqMessages,
        max_tokens,
        temperature: 0.4
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        timeout: 60000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content ?? "No response";
    res.json({ text });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err.message;
    console.log("Groq error:", details);
    res.status(status).json({ error: "API failed", details });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("GROQ_API_KEY loaded:", Boolean(process.env.GROQ_API_KEY));
});