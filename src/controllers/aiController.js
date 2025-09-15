const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateMessages = async (req, res) => {
  try {
    const { objective } = req.body;
    if (!objective) {
      return res.status(400).json({ error: "Campaign objective required" });
    }

    const prompt = `
You are a helpful assistant. Generate exactly 3 short promotional SMS messages (each <= 120 characters) for a marketing campaign with this objective:
"${objective}"

Important:
- ONLY return a JSON array of strings, e.g. ["msg1","msg2","msg3"].
- DO NOT include any explanation, markdown, or extra text; do not include code fences.
- Keep each message short, punchy, and safe for SMS.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",     
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 250,
    });

    let raw = "";
    if (response?.choices && response.choices.length > 0) {
      raw = response.choices[0].message?.content ?? response.choices[0].text ?? "";
    } else if (response?.data?.choices && response.data.choices.length > 0) {
      raw = response.data.choices[0].message?.content ?? response.data.choices[0].text ?? "";
    }
    raw = String(raw || "").trim();
    let t = raw.replace(/\r/g, "\n").trim();
    t = t.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1");
    t = t.replace(/(^`+|`+$)/g, "").trim();

    let suggestions = [];

    const jsonArrayMatch = t.match(/\[([\s\S]*)\]/s);
    if (jsonArrayMatch) {
      const jsonSubstring = "[" + jsonArrayMatch[1] + "]";
      try {
        const parsed = JSON.parse(jsonSubstring);
        if (Array.isArray(parsed)) suggestions = parsed;
      } catch (e) {
        console.warn("JSON.parse of array substring failed:", e.message);
      }
    }
    if (suggestions.length === 0) {
      try {
        const parsedWhole = JSON.parse(t);
        if (Array.isArray(parsedWhole)) suggestions = parsedWhole;
      } catch (e) {
      }
    }

    if (suggestions.length === 0) {
      const quoteMatches = [...t.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      if (quoteMatches.length > 0) suggestions = quoteMatches;
    }

    if (suggestions.length === 0) {
      const lines = t
        .split(/\n+/)
        .map((l) => l.replace(/^\s*[-\*\d\.\)\]]+\s*/, "").trim()) 
        .filter(Boolean);
      if (lines.length > 0) {
        if (lines.length === 1 && /,/.test(lines[0])) {
          const parts = lines[0].split(/\s*,\s*/).map((p) => p.trim()).filter(Boolean);
          if (parts.length > 1) suggestions = parts;
          else suggestions = lines;
        } else {
          suggestions = lines;
        }
      }
    }

    if (suggestions.length === 0 && t.length > 0) {
      suggestions = [t];
    }

    suggestions = suggestions
      .map((s) => String(s).trim().replace(/^[\[\]"']+|[\[\]"']+$/g, "").trim())
      .filter((s) => s && s.length > 0);

    if (suggestions.length > 3) suggestions = suggestions.slice(0, 3);

    return res.json({ suggestions });
  } catch (err) {
    console.error("AI error:", err);
    return res.status(500).json({ error: "Failed to generate messages" });
  }
};
