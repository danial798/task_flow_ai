# TaskFlow AI 🎯

**Intelligent Goal Planner & Execution Assistant**

Transform your ambitions into actionable roadmaps with AI-powered planning, smart tracking, and personalized productivity coaching.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991)](https://openai.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)

---

## 🌟 Overview

TaskFlow AI goes beyond traditional to-do lists by using GPT-4 to intelligently break down your goals into structured, actionable plans. Whether you're launching a startup, preparing for exams, or planning your fitness journey, TaskFlow AI acts as your personal productivity partner.

### The Problem We Solve

- 🤔 **Goal Paralysis**: Users struggle to break large goals into manageable steps
- 📋 **Static Planning**: Existing tools don't adapt when life gets in the way
- 🎯 **Context Loss**: No guidance on *how* to accomplish each task
- 📊 **Progress Blindness**: Difficulty tracking meaningful progress over time

### Our Solution

TaskFlow AI combines **AI planning**, **adaptive tracking**, and **personalized coaching** into one intelligent workspace that grows with you.

---

## ✨ Key Features

### 🤖 AI-Powered Goal Breakdown
Convert any goal into a structured roadmap with subtasks, milestones, and realistic timelines.

### 📚 Smart Resource Recommender
Get relevant guides, tutorials, and resources for each task automatically.

### 💬 AI Productivity Coach
Ask questions like "How do I complete this step?" and receive tailored, contextual advice.

### 📈 Progress Tracker & Insights
Dynamic timeline adjustments based on your actual progress, with intelligent forecasting.

### 🎯 Motivation System
Personalized reminders, motivational messages, and productivity insights to keep you on track.

### 📋 Goal Template Library
Pre-built templates for common goals:
- 💼 Startup Launch
- 📚 Exam Preparation
- 💪 Fitness Journey
- 🕌 Umrah Preparation
- 🎨 Creative Projects
- And more...

### 📝 Reflection Journal
Weekly AI-generated summaries analyzing what worked, what didn't, and how to improve.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: React Context / Zustand

### Backend
- **Runtime**: Node.js
- **Functions**: Firebase Cloud Functions
- **API Framework**: Next.js API Routes

### Database & Auth
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

### AI/ML
- **Primary Model**: OpenAI GPT-4
- **Embeddings**: OpenAI Embeddings API

### Deployment
- **Frontend Hosting**: Vercel
- **Backend**: Firebase
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account and project
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskflow-ai.git
cd taskflow-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for backend)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Initialize Firebase**
```bash
firebase init
```

Select:
- Firestore
- Functions
- Hosting

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
taskflow-ai/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Main dashboard
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── goals/
│   │       ├── tasks/
│   │       ├── coach/
│   │       └── reflections/
│   ├── api/               # API routes
│   │   ├── ai/
│   │   ├── goals/
│   │   └── tasks/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── goals/            # Goal-related components
│   └── ProtectedRoute.tsx
├── lib/                   # Utilities and helpers
│   ├── firebase/         # Firebase configuration
│   │   ├── config.ts
│   │   ├── admin.ts
│   │   └── firestore.ts
│   ├── openai/           # OpenAI integration
│   │   ├── client.ts
│   │   └── prompts.ts
│   ├── utils.ts
│   └── goal-templates.ts
├── hooks/                 # Custom React hooks
│   ├── use-auth.tsx
│   └── use-toast.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── functions/             # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── public/               # Static assets
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json
├── firebase.json
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password, Google)
4. Generate a new service account key for admin SDK
5. Add your domain to authorized domains in Firebase Authentication

### OpenAI Setup

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add billing information
4. Enable GPT-4 access (or use GPT-3.5 as fallback)

### Firestore Security Rules

The `firestore.rules` file contains security rules that:
- Ensure users can only access their own data
- Prevent unauthorized access to goals and tasks
- Allow public read access to goal templates

### Deploy Firebase Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

## 📦 Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
Add all environment variables from `.env.local` in Vercel dashboard

### Deploy Firebase Functions (Backend)

```bash
firebase deploy --only functions
```

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

## 🎯 Usage Guide

### Creating Your First Goal

1. Sign up or log in to your account
2. Click "New Goal" on the dashboard
3. Describe your goal (e.g., "Launch my SaaS product")
4. Add optional context about your experience or constraints
5. Click "Generate AI Roadmap"
6. Review the AI-generated tasks and resources
7. Save and start working!

### Working with Tasks

- Click on any goal to view its tasks
- Check off tasks as you complete them
- Progress automatically updates
- AI coach is available for help at any time

### Using the AI Coach

1. Navigate to the "AI Coach" page
2. Ask questions like:
   - "How do I overcome procrastination?"
   - "I'm stuck on this task, what should I do?"
   - "Give me motivation to keep going"
3. Get personalized, contextual advice

### Viewing Reflections

- Weekly reflections are automatically generated
- View insights about your progress
- Get AI recommendations for improvement
- Track your productivity score over time

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Firebase team for the excellent backend infrastructure
- Vercel for seamless deployment
- shadcn/ui for beautiful UI components
- The open-source community for inspiration

---

## 📧 Support

For support, email support@taskflow-ai.com or open an issue on GitHub.

**Built with ❤️ using AI and modern web technologies**

