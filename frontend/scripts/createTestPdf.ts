import * as fs from 'fs';
import * as path from 'path';

const testContent = `Financial Statement

Current Assets: 100000
Current Liabilities: 50000
Current Ratio: 2.0

Total Debt: 200000
Total Equity: 300000
Debt to Equity Ratio: 0.67

Net Income: 50000
Total Revenue: 500000
Profit Margin: 10.0

Total Assets: 600000`;

// Save as text file first
const filePath = path.join(__dirname, 'test.txt');
fs.writeFileSync(filePath, testContent);

console.log(`Test file created at: ${filePath}`);
console.log('Please convert test.txt to PDF manually using your preferred method'); 