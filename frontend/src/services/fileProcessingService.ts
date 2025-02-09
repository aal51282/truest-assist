import * as pdfjs from 'pdfjs-dist';
import { FinancialMetrics } from '@/types/financial';

// Initialize PDF.js worker
const initializeWorker = async () => {
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    try {
      // Use a direct path to the worker
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
      ).toString();
    } catch (error) {
      console.error('Error loading PDF worker:', error);
    }
  }
};

// Initialize the worker
initializeWorker();

export class FileProcessingService {
  static async processPdf(file: File): Promise<FinancialMetrics> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      // Enhanced pattern matching for financial metrics
      const metrics: FinancialMetrics = {
        currentRatio: undefined,
        debtToEquity: undefined,
        profitMargin: undefined,
        quickRatio: undefined,
        returnOnEquity: undefined,
        totalDebt: undefined,
        totalAssets: undefined,
      };

      // Pattern matching for direct values and calculated ratios
      const patterns = {
        currentRatio: [
          /current ratio[:\s]+(\d+\.?\d*)/i,
          /current assets\s*\/\s*current liabilities[:\s]+(\d+\.?\d*)/i,
        ],
        debtToEquity: [
          /debt to equity[:\s]+(\d+\.?\d*)/i,
          /total debt\s*\/\s*total equity[:\s]+(\d+\.?\d*)/i,
        ],
        profitMargin: [
          /profit margin[:\s]+(\d+\.?\d*)/i,
          /net profit margin[:\s]+(\d+\.?\d*)/i,
          /net income\s*\/\s*revenue[:\s]+(\d+\.?\d*)/i,
        ],
        quickRatio: [
          /quick ratio[:\s]+(\d+\.?\d*)/i,
          /\(current assets - inventory\)\s*\/\s*current liabilities[:\s]+(\d+\.?\d*)/i,
        ],
        returnOnEquity: [
          /return on equity[:\s]+(\d+\.?\d*)/i,
          /roe[:\s]+(\d+\.?\d*)/i,
        ],
      };

      // Try each pattern for each metric
      Object.entries(patterns).forEach(([metric, patternList]) => {
        for (const pattern of patternList) {
          const match = fullText.match(pattern);
          if (match) {
            metrics[metric as keyof FinancialMetrics] = parseFloat(match[1]);
            break;
          }
        }
      });

      // Calculate metrics from raw numbers if not found directly
      if (!metrics.currentRatio) {
        const currentAssets = this.extractNumber(fullText, /current assets[:\s]+(\d+\.?\d*)/i);
        const currentLiabilities = this.extractNumber(fullText, /current liabilities[:\s]+(\d+\.?\d*)/i);
        if (currentAssets && currentLiabilities) {
          metrics.currentRatio = currentAssets / currentLiabilities;
        }
      }

      if (!metrics.debtToEquity) {
        const totalDebt = this.extractNumber(fullText, /total debt[:\s]+(\d+\.?\d*)/i);
        const totalEquity = this.extractNumber(fullText, /total equity[:\s]+(\d+\.?\d*)/i);
        if (totalDebt && totalEquity) {
          metrics.debtToEquity = totalDebt / totalEquity;
          metrics.totalDebt = totalDebt; // Store total debt value
        }
      }

      if (!metrics.profitMargin) {
        const netIncome = this.extractNumber(fullText, /net income[:\s]+(\d+\.?\d*)/i);
        const revenue = this.extractNumber(fullText, /total revenue[:\s]+(\d+\.?\d*)/i);
        if (netIncome && revenue) {
          metrics.profitMargin = (netIncome / revenue) * 100;
        }
      }

      // Extract total assets
      const totalAssets = this.extractNumber(fullText, /total assets[:\s]+(\d+\.?\d*)/i);
      if (totalAssets) {
        metrics.totalAssets = totalAssets;
      }

      // Modify the validation to be less strict
      const validMetrics = Object.values(metrics).filter(value => value !== undefined);
      if (validMetrics.length === 0) {
        console.warn('No metrics found in PDF');
        return metrics; // Return empty metrics instead of throwing
      }

      return metrics;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error(`Failed to process PDF file: ${error.message}`);
    }
  }

  private static extractNumber(text: string, pattern: RegExp): number | null {
    const match = text.match(pattern);
    return match ? parseFloat(match[1]) : null;
  }

  static validateMetrics(metrics: FinancialMetrics): boolean {
    const validMetrics = Object.values(metrics).filter(value => value !== undefined);
    return validMetrics.length >= 2;
  }
}