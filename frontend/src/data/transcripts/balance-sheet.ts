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

export const balanceSheetTranscript: TranscriptSegment[] = [
  {
    startTime: 120,
    endTime: 121,
    text: "Let's check your understanding of the basic balance sheet concepts.",
    quiz: {
      questions: [
        {
          question: "What is the fundamental accounting equation?",
          options: [
            "Assets = Liabilities + Owner's Equity",
            "Assets = Liabilities - Owner's Equity",
            "Assets + Liabilities = Owner's Equity",
            "Revenue - Expenses = Profit"
          ],
          correctAnswer: 0,
          explanation: "The fundamental accounting equation states that Assets = Liabilities + Owner's Equity, which forms the basis of every balance sheet."
        },
        {
          question: "What does Accounts Receivable represent?",
          options: [
            "Money we owe to suppliers",
            "Money customers owe us for goods/services",
            "Cash in the bank",
            "Inventory we haven't sold yet"
          ],
          correctAnswer: 1,
          explanation: "Accounts Receivable represents money that customers owe us after we've sold them something but haven't received payment yet."
        },
        {
          question: "What's included in Cash and Equivalents from a finance perspective?",
          options: [
            "Only physical cash",
            "Cash and inventory",
            "Cash, marketable securities, and easily sellable assets",
            "Cash and accounts receivable"
          ],
          correctAnswer: 2,
          explanation: "From a finance perspective, Cash and Equivalents includes not just cash but also marketable securities and other liquid assets that can be easily sold."
        }
      ]
    }
  },
  {
    startTime: 210,
    endTime: 211,
    text: "Let's test your knowledge of current assets and liabilities.",
    quiz: {
      questions: [
        {
          question: "What makes something a prepaid expense?",
          options: [
            "When we receive payment before delivering a service",
            "When we pay for a benefit we'll receive in the future",
            "When we owe money to suppliers",
            "When customers owe us money"
          ],
          correctAnswer: 1,
          explanation: "Prepaid expenses occur when we pay ahead of time for a benefit or service that we'll receive in the future, making it an asset."
        },
        {
          question: "What's the key characteristic of Property, Plant, and Equipment (PPE)?",
          options: [
            "They can be sold quickly",
            "They're always buildings",
            "They have a useful life beyond one year",
            "They're always paid for in cash"
          ],
          correctAnswer: 2,
          explanation: "PPE items must be physical assets that provide benefit beyond one year, distinguishing them from current assets."
        },
        {
          question: "How is Accounts Payable created?",
          options: [
            "When customers pay us in advance",
            "When we prepay for services",
            "When we owe suppliers for inventory or services",
            "When we take out a bank loan"
          ],
          correctAnswer: 2,
          explanation: "Accounts Payable is created when we receive goods or services from suppliers but agree to pay for them later."
        }
      ]
    }
  },
  {
    startTime: 315,
    endTime: 316,
    text: "Let's review your understanding of different types of liabilities.",
    quiz: {
      questions: [
        {
          question: "Why is Deferred Revenue considered a liability?",
          options: [
            "Because we owe money to the bank",
            "Because we owe a product/service to the customer",
            "Because customers owe us money",
            "Because we haven't earned the revenue yet"
          ],
          correctAnswer: 1,
          explanation: "Deferred Revenue is a liability because we've received payment but still owe the customer the good or service they paid for."
        },
        {
          question: "What distinguishes long-term debt from other liabilities?",
          options: [
            "It doesn't require interest payments",
            "It's always from suppliers",
            "It's typically from financial institutions and requires interest payments",
            "It's paid off within one year"
          ],
          correctAnswer: 2,
          explanation: "Long-term debt typically comes from financial institutions like banks, requires interest payments, and has a repayment period longer than one year."
        },
        {
          question: "What are accrued liabilities?",
          options: [
            "Prepaid expenses we haven't used yet",
            "Services we've received but haven't paid for yet",
            "Money customers owe us",
            "Long-term bank loans"
          ],
          correctAnswer: 1,
          explanation: "Accrued liabilities occur when we receive a service or benefit but haven't paid for it yet, like receiving electricity service but paying the bill next month."
        }
      ]
    }
  },
  {
    startTime: 420,
    endTime: 421,
    text: "Final review of advanced concepts.",
    quiz: {
      questions: [
        {
          question: "What's the difference between operating and non-operating assets?",
          options: [
            "Operating assets are more expensive",
            "Operating assets come directly from business operations, non-operating don't",
            "Operating assets are always current assets",
            "There is no difference"
          ],
          correctAnswer: 1,
          explanation: "Operating assets and liabilities come directly from business operations (like inventory and accounts payable), while non-operating items (like cash and long-term debt) aren't directly tied to core operations."
        },
        {
          question: "What does retained earnings represent?",
          options: [
            "Money in the bank",
            "Current year's profit",
            "Accumulated profit minus dividends paid",
            "Money owed to shareholders"
          ],
          correctAnswer: 2,
          explanation: "Retained earnings represents the accumulated profit of the business, after subtracting any dividends that have been paid out to shareholders."
        },
        {
          question: "When does treasury stock occur?",
          options: [
            "When new shares are issued",
            "When dividends are paid",
            "When the company buys back its own shares",
            "When investors buy shares"
          ],
          correctAnswer: 2,
          explanation: "Treasury stock represents shares that the company has repurchased from shareholders, effectively reducing the number of outstanding shares."
        }
      ]
    }
  }
];

export const getQuizQuestions = () => {
  return balanceSheetTranscript
    .filter(segment => segment.quiz)
    .map(segment => ({
      timestamp: segment.startTime,
      questions: segment.quiz!.questions
    }));
}; 