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
    startTime: 90,
    endTime: 91,
    text: "Let's check your understanding of EBITDA basics.",
    quiz: {
      questions: [
        {
          question: "What does EBITDA stand for?",
          options: [
            "Earnings Before Interest, Taxes, Depreciation, and Amortization",
            "Earnings Before Income Tax and Debt Adjustments",
            "Earnings Before Interest and Tax Deductions Applied",
            "Earnings Before International Tax and Depreciation Allowances"
          ],
          correctAnswer: 0,
          explanation: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization, which helps evaluate a company's operating performance."
        },
        {
          question: "Why is interest added back in EBITDA calculations?",
          options: [
            "Because it represents the cost of financing and varies with debt structure",
            "Because it's not a real expense",
            "Because all companies have the same interest rates",
            "Because interest is always tax deductible"
          ],
          correctAnswer: 0,
          explanation: "Interest is added back because it represents financing costs that vary based on a company's debt structure, making comparisons between companies more meaningful."
        },
        {
          question: "Which of these is NOT a component added back in EBITDA?",
          options: [
            "Operating expenses",
            "Interest",
            "Depreciation",
            "Taxes"
          ],
          correctAnswer: 0,
          explanation: "Operating expenses are not added back in EBITDA calculations. Only interest, taxes, depreciation, and amortization are added back to net income."
        }
      ]
    }
  },
  {
    startTime: 180,
    endTime: 181,
    text: "Let's test your knowledge of EBITDA calculations.",
    quiz: {
      questions: [
        {
          question: "If a company has net income of $500,000, interest of $100,000, taxes of $150,000, and depreciation of $75,000, what is their EBITDA?",
          options: [
            "$825,000",
            "$750,000",
            "$650,000",
            "$500,000"
          ],
          correctAnswer: 0,
          explanation: "EBITDA = Net Income ($500,000) + Interest ($100,000) + Taxes ($150,000) + Depreciation ($75,000) = $825,000"
        },
        {
          question: "Why are depreciation and amortization added back in EBITDA?",
          options: [
            "They are non-cash expenses that don't represent actual cash outflows",
            "They are always tax deductible",
            "They increase company value",
            "They represent future investments"
          ],
          correctAnswer: 0,
          explanation: "Depreciation and amortization are added back because they are non-cash expenses that don't represent actual cash outflows from the business."
        },
        {
          question: "What is a limitation of using EBITDA?",
          options: [
            "It doesn't consider working capital requirements",
            "It's too difficult to calculate",
            "It includes too many expenses",
            "It's not used by investors"
          ],
          correctAnswer: 0,
          explanation: "A key limitation of EBITDA is that it doesn't consider working capital requirements or capital expenditures, which are crucial for many businesses."
        }
      ]
    }
  },
  {
    startTime: 270,
    endTime: 271,
    text: "Let's review the advantages of using EBITDA.",
    quiz: {
      questions: [
        {
          question: "What is a key advantage of using EBITDA for company comparisons?",
          options: [
            "It removes the impact of financing and accounting decisions",
            "It includes all possible expenses",
            "It shows exact cash flow",
            "It predicts future profits"
          ],
          correctAnswer: 0,
          explanation: "EBITDA is useful for comparing companies because it removes the impact of financing decisions and accounting choices, focusing on operational performance."
        },
        {
          question: "When is EBITDA particularly useful?",
          options: [
            "When comparing companies with significant depreciation expenses",
            "When calculating taxes",
            "When predicting stock prices",
            "When determining dividend payments"
          ],
          correctAnswer: 0,
          explanation: "EBITDA is particularly useful when comparing companies with significant depreciation or amortization expenses, as it removes these non-cash charges."
        },
        {
          question: "What best practice should be followed when using EBITDA?",
          options: [
            "Use it alongside other financial measures",
            "Use it as the only metric",
            "Ignore depreciation completely",
            "Focus only on net income"
          ],
          correctAnswer: 0,
          explanation: "EBITDA should be used alongside other financial measures to get a complete picture of a company's financial health, not as a standalone metric."
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