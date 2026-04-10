import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Allow requests from anywhere (or replace "*" with your frontend URL)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system",
          content: "You are a Study and Planning Assistant. Your job is to help students understand their tasks, plan ahead, and stay organized. Always use clear headings, bullet points, and numbered steps. Keep responses concise, structured, and easy to follow. When creating study plans, include daily breakdowns, time estimates, and simple explanations. When helping with planning, focus on prioritizing tasks, setting goals, and breaking work into manageable steps. Maintain an encouraging, easy-to-understand tone at all times."
        },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
