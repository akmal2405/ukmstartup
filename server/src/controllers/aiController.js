import Groq from "groq-sdk";

export const evaluateIdea = async (req, res) => {
  try {
    const { startupName, category, shortDescription } = req.body;

    if (!startupName || !category || !shortDescription) {
      return res.status(400).json({ message: "Missing idea details" });
    }

    // Move client initialization inside the function
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      You are a startup evaluator. Evaluate this startup idea and respond in JSON only.
      
      Startup Name: ${startupName}
      Category: ${category}
      Description: ${shortDescription}
      
      Respond with this exact JSON structure, no markdown, no explanation:
      {
        "score": <number 1-10>,
        "summary": "<2 sentence summary in Bahasa Malaysia>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "improvements": ["<improvement 1>", "<improvement 2>"],
        "verdict": "<Berpotensi Tinggi | Berpotensi Sederhana | Perlu Penambahbaikan>"
      }
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const evaluation = JSON.parse(clean);

    res.json(evaluation);
  } catch (error) {
    console.error("AI evaluation error:", error.message);
    res.status(500).json({ message: "Failed to evaluate idea" });
  }
};