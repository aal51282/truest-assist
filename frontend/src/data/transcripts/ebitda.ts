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

export const getQuizQuestions = () => {
  return ebitdaTranscript
    .filter(segment => segment.quiz)
    .map(segment => ({
      timestamp: segment.startTime,
      questions: segment.quiz!.questions
    }));
}; 