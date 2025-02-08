# Truest Assist - Financial Analysis Gamification Platform

A gamified platform that helps employees understand and analyze financial metrics through interactive learning and real-world data analysis.

## 🎯 Overview

Truest Assist transforms complex financial analysis into an engaging, game-like experience. Users can learn about financial metrics, analyze real company data, and earn rewards while building their financial acumen.

## ✨ Key Features

### 🎮 Interactive Learning Modules

- **Balance Sheet Basics**
  - Interactive tutorials on income, revenue, profit
  - Visual breakdowns of assets, liabilities, and equity
  - Practice exercises with real-world examples

- **EBITDA Analysis**
  - Step-by-step EBITDA calculation guide
  - Interactive calculator with tooltips
  - Visualization of operating income, depreciation, and amortization

- **Comparative Analysis**
  - Historical trend visualization
  - Cross-company metric comparison
  - Industry benchmark analysis

### 📊 Analysis Tools

- Document upload and parsing for financial statements
- Automated data extraction and processing
- Custom metric calculators
- Interactive data visualization dashboards
- Company comparison tools

### 🏆 Gamification Elements

- Achievement-based progression system
- Skill badges and certifications
- Points system for completed analyses
- Leaderboards and challenges
- Progress tracking and milestones

## 🛠 Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS

### Backend
- Python FastAPI
- MongoDB for data storage

### Infrastructure
- Docker for containerization
- AWS/Vercel for deployment
- GitHub Actions for CI/CD

## 🚀 Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/aal51282/ugahacks2025
cd ugahacks2025
```

2. Install frontend dependencies
```bash
cd frontend
pnpm install
```

3. Install backend dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

5. Start development servers

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
uvicorn main:app --reload
```

## 📱 Usage

1. Register an account and complete your profile
2. Start with the Balance Sheet Basics module
3. Progress through interactive lessons
4. Upload financial documents for analysis
5. Earn points and badges as you complete tasks
6. Compare your analysis with peers
7. Track your progress on the leaderboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.