// pages/api/generateQuestion.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type QuestionResponse = {
  question?: string;
  correctAnswer?: string;
  wrongAnswers?: string[];
  answerOptions?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { difficulty, promptWords } = req.body;

    // Validate input
    if (!difficulty || !promptWords) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle both array and string inputs for promptWords
    const keywords = Array.isArray(promptWords)
      ? promptWords.join(", ")
      : promptWords;

    let systemPrompt = `You are an expert finance educator. Generate questions that are clear and educational.`;
    let userPrompt = `Generate a ${difficulty} finance question about: ${keywords}.`;

    if (difficulty === "easy") {
      userPrompt += `
            Format your response EXACTLY like this:
            QUESTION: [Write your question here]
            CORRECT: [Write the correct answer]
            WRONG1: [First wrong answer]
            WRONG2: [Second wrong answer]
            WRONG3: [Third wrong answer]`;
    } else {
      userPrompt += `
            Format your response EXACTLY like this:
            QUESTION: [Write your question here]`;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from Groq");
    }

    // Update parsing based on difficulty
    const lines = response.split("\n");
    if (difficulty === "easy") {
      const question =
        lines
          .find((l) => l.trim().startsWith("QUESTION:"))
          ?.replace("QUESTION:", "")
          .trim() || response;
      const correctAnswer =
        lines
          .find((l) => l.trim().startsWith("CORRECT:"))
          ?.replace("CORRECT:", "")
          .trim() || "";
      const wrongAnswers = [
        lines
          .find((l) => l.trim().startsWith("WRONG1:"))
          ?.replace("WRONG1:", "")
          .trim() || "",
        lines
          .find((l) => l.trim().startsWith("WRONG2:"))
          ?.replace("WRONG2:", "")
          .trim() || "",
        lines
          .find((l) => l.trim().startsWith("WRONG3:"))
          ?.replace("WRONG3:", "")
          .trim() || "",
      ].filter(Boolean);

      return res.status(200).json({ question, correctAnswer, wrongAnswers });
    } else {
      const question =
        lines
          .find((l) => l.trim().startsWith("QUESTION:"))
          ?.replace("QUESTION:", "")
          .trim() || response;
      return res.status(200).json({ question });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error generating question" });
  }
}
