import * as pdfjs from 'pdfjs-dist';
import { FinancialMetrics } from '@/types/financial';

export class FileProcessingService {
  static async processPdf(file: File): Promise<FinancialMetrics> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

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
    };

    // More sophisticated pattern matching
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

    return metrics;
  }

  static validateMetrics(metrics: FinancialMetrics): boolean {
    // Check if at least two metrics were successfully extracted
    const validMetrics = Object.values(metrics).filter(value => value !== undefined);
    return validMetrics.length >= 2;
  }
}