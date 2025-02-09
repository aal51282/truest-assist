interface FinancialData {
  currentRatio: number;
  debtToEquity: number;
  profitMargin: number;
  // Add more metrics as needed
}

export async function fetchCompanyFinancials(symbol: string): Promise<FinancialData> {
  // Replace YOUR_API_KEY with actual API key
  const API_KEY = process.env.NEXT_PUBLIC_FINANCIAL_API_KEY;
  
  try {
    // Example using Financial Modeling Prep API
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/ratios/${symbol}?apikey=${API_KEY}`
    );
    const data = await response.json();
    
    // Process and return the data
    return {
      currentRatio: data[0].currentRatio,
      debtToEquity: data[0].debtToEquityRatio,
      profitMargin: data[0].netProfitMargin,
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
} 