export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  targetDate: Date;
  estimatedDuration?: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  resources?: Resource[];
  aiGenerated: boolean;
  completionPercentage: number;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  dueDate?: Date;
  estimatedDuration?: string;
  actualDuration?: string;
  dependencies?: string[]; // Task IDs
  subtasks?: Subtask[];
  resources?: Resource[];
  progressLogs: ProgressLog[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface ProgressLog {
  id: string;
  taskId: string;
  userId: string;
  note: string;
  progressPercentage: number;
  timestamp: Date;
  mood?: 'frustrated' | 'neutral' | 'motivated' | 'accomplished';
}

export interface Resource {
  id: string;
  type: 'article' | 'video' | 'course' | 'tool' | 'book' | 'other';
  title: string;
  url?: string;
  description?: string;
  aiRecommended: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  goalId?: string;
  taskId?: string;
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  summary: string;
  achievements: string[];
  challenges: string[];
  recommendations: string[];
  goalsCompleted: number;
  tasksCompleted: number;
  productivityScore: number;
  generatedAt: Date;
}

export interface GoalTemplate {
  id: string;
  name: string;
  category: GoalCategory;
  description: string;
  icon: string;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  templateTasks: TemplateTask[];
}

export interface TemplateTask {
  title: string;
  description: string;
  estimatedDuration: string;
  order: number;
}

export type GoalCategory = 
  | 'career'
  | 'education'
  | 'fitness'
  | 'personal'
  | 'creative'
  | 'financial'
  | 'spiritual'
  | 'travel'
  | 'other';

export type GoalStatus = 
  | 'planning'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'abandoned';

export type TaskStatus = 
  | 'pending'
  | 'in-progress'
  | 'blocked'
  | 'completed'
  | 'cancelled';

export interface AIGoalBreakdown {
  goal: {
    title: string;
    description: string;
    estimatedDuration: string;
    category: GoalCategory;
  };
  tasks: {
    title: string;
    description: string;
    estimatedDuration: string;
    priority: 'low' | 'medium' | 'high';
    order: number;
    subtasks?: string[];
  }[];
  resources: Resource[];
  milestones: {
    title: string;
    targetDate: string;
    tasksIncluded: number[];
  }[];
  tips: string[];
}

export interface AICoachResponse {
  message: string;
  suggestions?: string[];
  resources?: Resource[];
  motivationalQuote?: string;
}

