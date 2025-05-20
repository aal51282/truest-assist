// pages/api/evaluateResponse.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type EvaluationResponse = {
  isCorrect?: boolean;
  feedback?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EvaluationResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, userAnswer, difficulty } = req.body;

    let systemPrompt = `You are an expert finance educator evaluating student responses. 
            Provide constructive feedback, no more than 200 characters, and determine if the answer is correct.`;

    let userPrompt = `
            Question: ${question}
            Student's Answer: ${userAnswer}
            Difficulty Level: ${difficulty}

            Evaluate if the student's answer is correct. For easy questions, it must match exactly.
            For medium/hard questions, evaluate if the core concept is correct even if worded differently.
            
            Format your response exactly like this:
            CORRECT: [true/false]
            FEEDBACK: [your detailed feedback]
        `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama3-8b-8192",
      temperature: 0.3, // Lower temperature for more consistent evaluation
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from Groq");
    }

    const lines = response.split("\n");
    const isCorrect =
      lines
        .find((l) => l.startsWith("CORRECT:"))
        ?.replace("CORRECT:", "")
        .trim()
        .toLowerCase() === "true";
    const feedback = lines
      .find((l) => l.startsWith("FEEDBACK:"))
      ?.replace("FEEDBACK:", "")
      .trim();

    return res.status(200).json({
      isCorrect,
      feedback,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error evaluating response" });
  }
}
