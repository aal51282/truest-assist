interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  };
}

export const ebitdaTranscript: TranscriptSegment[] = [
  {
    startTime: 40,
    endTime: 41,
    text: "Let's test your understanding of EBITDA fundamentals.",
    quiz: {
      questions: [
        {
          question: "What is the main purpose of using EBITDA?",
          options: [
            "To calculate a company's tax obligations",
            "To measure operating performance on a normalized basis",
            "To determine dividend payments",
            "To calculate total revenue"
          ],
          correctAnswer: 1,
          explanation: "EBITDA is used to measure a company's operating performance on a normalized basis by removing items that business managers have discretion over, like debt financing and capital expenditures."
        },
        {
          question: "What does EBITDA remove from earnings?",
          options: [
            "Operating expenses",
            "Revenue",
            "Items managers have discretion over (like debt financing and capex)",
            "Employee salaries"
          ],
          correctAnswer: 2,
          explanation: "EBITDA removes items that business managers have discretion over, such as debt financing and capital expenditures, to showcase financial performance without capital structure or capex requirements."
        }
      ]
    }
  },
  {
    startTime: 65,
    endTime: 66,
    text: "Let's check your understanding of EBITDA calculations.",
    quiz: {
      questions: [
        {
          question: "What are the two ways to calculate EBITDA?",
          options: [
            "Net Income + Interest + Taxes + D&A, or EBIT + D&A",
            "Revenue - Expenses, or Net Income - D&A",
            "Gross Profit + Operating Expenses, or EBIT - D&A",
            "Total Assets - Total Liabilities, or Equity + D&A"
          ],
          correctAnswer: 0,
          explanation: "EBITDA can be calculated either by starting with net income and adding back interest, taxes, depreciation and amortization, or by taking EBIT and adding back D&A."
        },
        {
          question: "Where can you find depreciation and amortization (D&A) figures?",
          options: [
            "Only in the income statement",
            "Only in the balance sheet",
            "In the cash flow statement if not broken out in the income statement",
            "Only in the notes to financial statements"
          ],
          correctAnswer: 2,
          explanation: "While D&A might be shown in the income statement, you may need to look at the cash flow statement to find D&A figures if they're not explicitly broken out in the income statement."
        }
      ]
    }
  },
  {
    startTime: 106,
    endTime: 107,
    text: "Let's review the pros of using EBITDA.",
    quiz: {
      questions: [
        {
          question: "What is a key advantage of using EBITDA?",
          options: [
            "It's recognized by GAAP",
            "It makes companies more comparable by removing noise below operating income",
            "It includes all capital expenditures",
            "It shows exact tax obligations"
          ],
          correctAnswer: 1,
          explanation: "EBITDA makes different companies more comparable by removing noise below operating income, including one-time items, allowing for better comparison between companies."
        },
        {
          question: "Why is EBITDA useful for early-stage companies?",
          options: [
            "It requires less calculation",
            "It's required by regulators",
            "It can be positive even when earnings aren't",
            "It includes all expenses"
          ],
          correctAnswer: 2,
          explanation: "EBITDA is useful for early-stage companies or those with volatile earnings because it can be positive even when earnings are not, providing a measure of operating performance."
        }
      ]
    }
  },
  {
    startTime: 150,
    endTime: 151,
    text: "Let's examine the limitations of EBITDA.",
    quiz: {
      questions: [
        {
          question: "What is a major limitation of EBITDA?",
          options: [
            "It's too simple to calculate",
            "It presents companies as if they never pay taxes or interest",
            "It's not used by analysts",
            "It's too complex for investors"
          ],
          correctAnswer: 1,
          explanation: "A major limitation of EBITDA is that it presents companies as though they never pay taxes, interest, or capital expenditures, which isn't realistic."
        },
        {
          question: "Which accounting standard recognizes EBITDA?",
          options: [
            "Both GAAP and IFRS",
            "Only GAAP",
            "Only IFRS",
            "Neither GAAP nor IFRS"
          ],
          correctAnswer: 3,
          explanation: "EBITDA is not recognized by either GAAP or IFRS accounting standards, which is one of its limitations despite being frequently quoted."
        }
      ]
    }
  }
];

export const depreciationTranscript: TranscriptSegment[] = [
  {
    startTime: 60,
    endTime: 61,
    text: "Let's test your understanding of capital expenses and the matching principle.",
    quiz: {
      questions: [
        {
          question: "What is the key difference between operating expenses and capital expenses?",
          options: [
            "Operating expenses are paid monthly, capital expenses yearly",
            "Operating expenses hit the P&L immediately, capital expenses are spread over time",
            "Operating expenses are for small items, capital expenses for large items",
            "Operating expenses are optional, capital expenses are mandatory"
          ],
          correctAnswer: 1,
          explanation: "Operating expenses hit the P&L (income statement) as they happen, while capital expenses are spread out over the period the asset will be used, following the matching principle."
        },
        {
          question: "What is the matching principle in accounting?",
          options: [
            "Matching revenues with expenses",
            "Matching assets with liabilities",
            "Matching the expense of an asset with the benefit derived from it",
            "Matching depreciation with amortization"
          ],
          correctAnswer: 2,
          explanation: "The matching principle aims to match the expense of something with the benefit derived from it, which is why capital expenses are spread out over the asset's useful life."
        }
      ]
    }
  },
  {
    startTime: 160,
    endTime: 161,
    text: "Let's check your understanding of FASB and asset useful life.",
    quiz: {
      questions: [
        {
          question: "What role does FASB play in depreciation?",
          options: [
            "They collect taxes on depreciated assets",
            "They set standards for useful life of assets",
            "They manage company assets",
            "They approve capital expenses"
          ],
          correctAnswer: 1,
          explanation: "The Financial Accounting Standards Board (FASB) sets the standards for what constitutes the useful life for different types of assets."
        },
        {
          question: "Which asset typically has the longest useful life according to FASB?",
          options: [
            "Computers (3-5 years)",
            "Delivery trucks (7-9 years)",
            "Office buildings (30-40 years)",
            "Software licenses"
          ],
          correctAnswer: 2,
          explanation: "Real estate assets like office buildings have the longest useful life, typically 30-40 years, compared to computers (3-5 years) or vehicles (7-9 years)."
        }
      ]
    }
  },
  {
    startTime: 230,
    endTime: 231,
    text: "Let's review the difference between depreciation and amortization.",
    quiz: {
      questions: [
        {
          question: "What determines whether an asset is depreciated or amortized?",
          options: [
            "Whether it's tangible or intangible",
            "The cost of the asset",
            "The useful life length",
            "The tax benefits"
          ],
          correctAnswer: 0,
          explanation: "Depreciation is used for tangible assets (things we can touch like equipment), while amortization is used for intangible assets (like software and patents)."
        },
        {
          question: "Which of these would be amortized rather than depreciated?",
          options: [
            "Delivery trucks",
            "Factory equipment",
            "Office furniture",
            "Software licenses and patents"
          ],
          correctAnswer: 3,
          explanation: "Software licenses and patents are intangible assets, so they would be amortized. The other options are tangible assets that would be depreciated."
        }
      ]
    }
  },
  {
    startTime: 270,
    endTime: 271,
    text: "Let's examine the benefits of depreciation and amortization.",
    quiz: {
      questions: [
        {
          question: "Why is it beneficial to spread out capital expenses over time?",
          options: [
            "It makes accounting easier",
            "It prevents lumpy profitability and provides tax benefits",
            "It reduces the cost of assets",
            "It increases the asset's value"
          ],
          correctAnswer: 1,
          explanation: "Spreading out capital expenses prevents lumpy profitability (big drops in profit when assets are purchased) and provides tax benefits over time."
        },
        {
          question: "What would happen if companies expensed the full cost of assets upfront?",
          options: [
            "Profits would be artificially high in year 0",
            "Profits would drop significantly in year 0 and be artificially high later",
            "There would be no impact on profits",
            "The company would pay less taxes"
          ],
          correctAnswer: 1,
          explanation: "If companies expensed assets upfront, it would significantly reduce profits in the purchase year (year 0) and then artificially increase profits in subsequent years since no costs would be recorded against the asset's benefits."
        }
      ]
    }
  }
];

export const getQuizQuestions = () => {
  return ebitdaTranscript
    .filter(segment => segment.quiz)
    .map(segment => ({
      timestamp: segment.startTime,
      questions: segment.quiz!.questions
    }));
};

export const getDepreciationQuizQuestions = () => {
  return depreciationTranscript
    .filter(segment => segment.quiz)
    .map(segment => ({
      timestamp: segment.startTime,
      questions: segment.quiz!.questions
    }));
}; 