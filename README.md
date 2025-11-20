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
- **Frontend Hosting**: Netlify
- **Backend**: Firebase
- **CI/CD**: GitHub Actions

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
- Weekly reflections are automatically generated
- View insights about your progress
- Get AI recommendations for improvement
- Track your productivity score over time

---
