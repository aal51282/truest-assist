# Truest Assist - Financial Analysis Gamification Platform

A gamified platform that engages employees and individuals in understanding and analyzing financial metrics through interactive learning and real-world data insights.

# Members - Helen Belete, Angel Loaiza, Dinesha Shair, Lilian Valdes

## EL Credit for Angel Loaiza (Summary of Project Log)

Tier Level: Advanced

Friday - Project Planning
Goals: Build an AI-powered application and align with the hackathon's theme.
Progress:
Narrowed down project ideas to Truist’s Gamify Challenge.
Assigned tasks: UI design in Figma, backend setup, researching LLM APIs.
Challenges:
Lacked financial expertise → Used AI to generate content.
Ensuring gamification was meaningful → Added achievements, badges, and confetti effects.
Learning: Gamification improves retention, and AI tools like Groq can assist in content generation.

Saturday - Development Phase
Goals: Complete most of the project, fully integrate two AI models, finalize UI.
Progress:
Developed sleek UI and connected authentication (MongoDB).
Implemented Groq AI to generate quiz questions dynamically.
Created AI-generated quizzes embedded in videos.
Worked on the analysis page UI and prepared the submission (Devpost, video, slides).
Challenges:
Keeping UI simple yet engaging → Used video modules with pop-up AI quizzes.
Ensuring AI-generated questions were relevant to video sections → Considered breaking transcripts into smaller segments but lacked time.
Learning: Gained experience in frontend development, video integration, and AI-powered dynamic quizzes.

Sunday - Finalization & Submission
Goals: Complete slide deck, deploy project, and refine the pitch.
Progress:
Finalized Figma, slide deck, and demo video.
Submitted project to Devpost and prepared for judging.
Challenges:
Deployment concerns → Prioritized stability over last-minute changes.

## 🎯 Overview

Truest Assist transforms complex financial analysis into an engaging, game-like experience. Users can learn about financial metrics, analyze real company data, and earn rewards while building their financial acumen.

## ✨ Key Features

### 🎮 Interactive Learning Modules

- **Balance Sheet Basics**
  - Interactive tutorials on Balance Sheet Basics, EBITDA, and Horizontal Analysis 
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
- Interactive data visualization dashboards
- Company comparison tools

### 🏆 Gamification Elements

- Achievement-based progression system
- Skill badges and certifications
- Points system for completed analyses
- Leaderboards and challenges
- Progress tracking and milestones

## 🛠 Tech Stack
- Typescript
- React
- MongoDB Atlas
- Next.js
- TailwindCSS


### Frontend
- Next.js 14
- TypeScript
- TailwindCSS

### Backend
- Next.js
- Bcrypt
- MongoDB for data storage

## Challenges We Faced and How We Overcame Them  

### 1. Leveraging Team Strengths Effectively  
**Challenge:** Initially, we faced difficulties in assigning tasks efficiently, as we weren’t fully aware of each team member’s strengths.  
**Solution:** We took the time to assess our individual skills and interests, allowing us to delegate tasks more strategically. This improved workflow, collaboration, and overall productivity.  

### 2. Overcoming Hesitation in Seeking External Guidance  
**Challenge:** At first, we were hesitant to attend workshops and approach company booths, thinking we had to solve everything on our own.  
**Solution:** We stepped out of our comfort zones, engaged with industry professionals, and attended workshops. This gave us valuable insights that significantly improved our project’s direction and quality.  

### 3. Bridging Knowledge Gaps  
**Challenge:** Some aspects of financial analytics and gamification were new to us, making it difficult to implement certain features.  
**Solution:** We actively researched, collaborated, and incorporated insights from workshops to enhance our understanding. This helped us build a more well-rounded and effective project.  


### Infrastructure
- Groq
- AWS for deployment
- FMP (Financial Modeling Performance) API
- Mongo DB Atlas
- Speech Recogonition API

## 🚀 Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/aal51282/ugahacks2025
cd ugahacks2025
```

2. Install dependencies
```bash
cd frontend
pnpm install
```

4. Set up environment variables
```bash
cp frontend/.env.example frontend/.env
```

5. Start development servers

Frontend:
```bash
cd frontend
npm run dev
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
