const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables from .env (for local testing)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("MediCheck backend is running (Groq)");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY in environment. Add it in Render dashboard."
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

    // Prepare messages for Groq API
    const groqMessages = [
      ...(system ? [{ role: "system", content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    // Call Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      { model, messages: groqMessages, max_tokens, temperature: 0.4 },
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
    console.error("Groq API error:", details);
    res.status(status).json({ error: "API failed", details });
  }
});

// Use PORT from environment, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("GROQ_API_KEY loaded:", Boolean(process.env.GROQ_API_KEY));
});
