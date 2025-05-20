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
  chartData?: {
    labels: string[];
    userValues: number[];
    companyValues: number[];
    ratioNames: string[];
    userRatios: number[];
    companyRatios: number[];
  };
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
      // First, get the structured data for visualization
      const structuredDataCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a financial analysis AI that extracts structured data from balance sheets for visualization purposes. You will provide numerical data that can be used to create comparative charts.",
          },
          {
            role: "user",
            content: `
              Extract key financial metrics from this balance sheet for visualization purposes:
              
              ${truncatedContent}
              
              I need to compare this data with ${companyName}.
              
              Return ONLY a valid JSON object with the following structure:
              {
                "assetCategories": ["Cash", "Accounts Receivable", "Inventory", "Fixed Assets", "Other Assets"],
                "assetValues": [10000, 5000, 15000, 25000, 5000],
                "liabilityCategories": ["Accounts Payable", "Short-term Debt", "Long-term Debt", "Other Liabilities"],
                "liabilityValues": [8000, 5000, 20000, 2000],
                "keyRatios": {
                  "currentRatio": 2.1,
                  "quickRatio": 1.5,
                  "debtToEquity": 1.2,
                  "returnOnAssets": 0.12,
                  "returnOnEquity": 0.18
                },
                "companyComparison": {
                  "currentRatio": 1.8,
                  "quickRatio": 1.3,
                  "debtToEquity": 1.4,
                  "returnOnAssets": 0.15,
                  "returnOnEquity": 0.22
                }
              }
              
              Ensure all values are estimates based on the balance sheet data. For company comparison, use typical values for ${companyName} or industry averages.
            `,
          },
        ],
        model: "llama3-8b-8192",
        temperature: 0.1,
        max_tokens: 800,
        top_p: 0.9,
      });

      let chartData;
      try {
        // Parse the structured data response
        const structuredDataResponse =
          structuredDataCompletion.choices[0]?.message?.content || "{}";
        const jsonStartIdx = structuredDataResponse.indexOf("{");
        const jsonEndIdx = structuredDataResponse.lastIndexOf("}") + 1;
        const jsonStr = structuredDataResponse.slice(jsonStartIdx, jsonEndIdx);
        const structuredData = JSON.parse(jsonStr);

        // Transform data for chart components
        chartData = {
          labels: [...structuredData.assetCategories] as string[],
          userValues: [...structuredData.assetValues] as number[],
          companyValues: structuredData.assetValues.map(
            (val: number) => val * (Math.random() * 0.5 + 0.75)
          ), // Simulated comparison
          ratioNames: Object.keys(structuredData.keyRatios) as string[],
          userRatios: Object.values(structuredData.keyRatios) as number[],
          companyRatios: Object.values(
            structuredData.companyComparison
          ) as number[],
        };
      } catch (parseError) {
        console.error("Error parsing structured data:", parseError);
        chartData = {
          labels: ["Cash", "Receivables", "Inventory", "Fixed Assets", "Other"],
          userValues: [20, 30, 15, 25, 10],
          companyValues: [25, 20, 20, 30, 5],
          ratioNames: [
            "Current Ratio",
            "Quick Ratio",
            "Debt-to-Equity",
            "ROA",
            "ROE",
          ],
          userRatios: [1.5, 1.2, 1.3, 0.08, 0.12],
          companyRatios: [1.8, 1.4, 1.1, 0.1, 0.15],
        };
      }

      // Now get the textual analysis
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

      return res.status(200).json({ analysis, chartData });
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
