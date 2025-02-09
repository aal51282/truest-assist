interface CompanyFinancials {
  symbol: string;
  name: string;
  currentRatio: number;
  debtToEquity: number;
  profitMargin: number;
  quickRatio: number;
  returnOnEquity: number;
  totalDebt: number;
  totalAssets: number;
}

export async function fetchCompanyFinancials(symbols: string[]): Promise<CompanyFinancials[]> {
  const API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
  
  try {
    const companies = await Promise.all(
      symbols.map(async (symbol) => {
        // Fetch ratios
        const ratiosResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${API_KEY}`
        );
        const ratiosData = await ratiosResponse.json();

        // Fetch basic company info
        const profileResponse = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`
        );
        const profileData = await profileResponse.json();

        return {
          symbol,
          name: profileData[0].companyName,
          currentRatio: ratiosData[0].currentRatioTTM,
          debtToEquity: ratiosData[0].debtEquityRatioTTM,
          profitMargin: ratiosData[0].netProfitMarginTTM,
          quickRatio: ratiosData[0].quickRatioTTM,
          returnOnEquity: ratiosData[0].returnOnEquityTTM,
          totalDebt: ratiosData[0].totalDebtToTotalAssetsTTM,
          totalAssets: ratiosData[0].totalAssetsTurnoverTTM,
        };
      })
    );

    return companies;
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
} 