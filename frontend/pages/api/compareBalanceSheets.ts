import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type ResponseData = {
  analysis?: string;
  error?: string;
};

// Interface for Groq API errors
interface GroqApiError extends Error {
  status?: number;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

// Helper function to truncate balance sheet content if it's too large
// This helps prevent token limit errors with the Groq API
const truncateContent = (content: string, maxLength = 4000): string => {
  if (content.length <= maxLength) return content;

  // If we need to truncate, add a message explaining this
  const truncatedContent = content.substring(0, maxLength);
  return `${truncatedContent}\n\n[Note: The balance sheet content was truncated due to its size. The analysis is based on the visible portion.]`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    const userFile = files.userFile?.[0];
    const companyName = fields.companyName?.[0] || "Unknown Company";
    const fileContent = fields.fileContent?.[0];

    let userBalanceSheetContent = "";

    // Get content from uploaded file or text content
    if (userFile) {
      userBalanceSheetContent = fs.readFileSync(userFile.filepath, "utf8");
    } else if (fileContent) {
      userBalanceSheetContent = fileContent;
    } else {
      return res
        .status(400)
        .json({ error: "No balance sheet content provided" });
    }

    // Truncate content if it's too large to avoid rate limit errors
    const truncatedContent = truncateContent(userBalanceSheetContent);

    try {
      // Analyze the balance sheets using Groq
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a financial analyst expert, specialized in comparing balance sheets and providing detailed analysis. Your analysis should be educational, highlighting key metrics and explaining what they mean for business health. Format your response with clear sections, bullet points for key findings, and explanations that would help someone learn financial analysis fundamentals.",
          },
          {
            role: "user",
            content: `
              Please analyze the following balance sheet information and provide a comparative analysis with ${companyName}.
              
              User's Balance Sheet:
              ${truncatedContent}
              
              Provide a comprehensive analysis with the following sections:
              
              1. FINANCIAL RATIOS COMPARISON
              - Calculate and compare key financial ratios (liquidity, solvency, profitability)
              - Explain what each ratio means and how it compares to industry standards
              
              2. STRENGTHS & WEAKNESSES
              - Identify 3-5 key strengths in the user's financial position
              - Identify 3-5 areas that need improvement
              - Explain the significance of each point
              
              3. ACTIONABLE RECOMMENDATIONS
              - Provide 3-5 specific, actionable steps to improve financial health
              - Prioritize recommendations by potential impact
              
              4. OVERALL ASSESSMENT
              - Summarize the overall financial health in 2-3 sentences
              - Provide a forward-looking statement on potential trajectory
              
              Make your analysis educational, explaining concepts as you analyze them, so the user learns while reviewing the analysis.
            `,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.4,
        max_tokens: 2000, // Reduced from 3000 to stay within limits
        top_p: 0.9,
      });

      const analysis =
        completion.choices[0]?.message?.content ||
        "No analysis could be generated";

      return res.status(200).json({ analysis });
    } catch (error: unknown) {
      console.error("Groq API Error:", error);

      const groqError = error as GroqApiError;

      // Handle rate limit or token limit errors specifically
      if (
        groqError?.status === 413 ||
        (groqError?.error && groqError.error.code === "rate_limit_exceeded")
      ) {
        return res.status(500).json({
          error:
            "The balance sheet is too large for analysis. Please try with a smaller or more concise balance sheet.",
        });
      }

      // Handle other API errors
      return res.status(500).json({
        error: "Error analyzing balance sheets. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Error processing your request" });
  }
}
