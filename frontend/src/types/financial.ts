export interface FinancialMetrics {
  currentRatio?: number;
  debtToEquity?: number;
  profitMargin?: number;
  quickRatio?: number;
  returnOnEquity?: number;
  totalDebt?: number;
  totalAssets?: number;
}

export interface CompanyComparison {
  symbol: string;
  name: string;
  metrics: FinancialMetrics;
  logoUrl: string;
} 