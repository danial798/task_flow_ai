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

// ===== NEW: ADAPTIVE & INTELLIGENT FEATURES =====

export interface UserPreferences {
  userId: string;
  averageTaskDuration: number; // minutes
  preferredTaskSize: 'small' | 'medium' | 'large';
  mostProductiveTime: 'morning' | 'afternoon' | 'evening' | 'night';
  workingHoursPerDay: number;
  categoryPerformance: {
    [category: string]: {
      completionRate: number;
      averageSpeed: number; // actual vs estimated ratio
    };
  };
  taskTypePerformance: {
    [taskType: string]: {
      completionRate: number;
      averageSpeed: number;
    };
  };
  streakCount: number;
  lastUpdated: Date;
}

export interface TaskCompletionStats {
  taskId: string;
  estimatedDuration: number; // minutes
  actualDuration: number; // minutes
  completedOnTime: boolean;
  skipped: boolean;
  category: string;
  taskType: string; // extracted from task title (e.g., "design", "research", "coding")
  completedAt: Date;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  goalId?: string;
  duration: number; // minutes
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  checkIns: {
    timestamp: Date;
    message: string;
    userResponse?: string;
  }[];
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'bottleneck' | 'pattern' | 'recommendation' | 'warning' | 'achievement';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionable: boolean;
  suggestedAction?: string;
  relatedGoalId?: string;
  relatedTaskId?: string;
  createdAt: Date;
  dismissed: boolean;
}

export interface MotivationMessage {
  id: string;
  userId: string;
  message: string;
  type: 'daily' | 'milestone' | 'streak' | 'encouragement' | 'challenge';
  tone: 'friendly' | 'professional' | 'motivational' | 'coach';
  createdAt: Date;
  displayed: boolean;
}

export interface TaskPriorityScore {
  taskId: string;
  score: number; // 1-100
  factors: {
    urgency: number; // 0-10 (based on due date)
    importance: number; // 0-10 (AI-determined)
    impact: number; // 0-10 (affects other tasks/goals)
    effort: number; // 0-10 (estimated difficulty)
    userPreference: number; // 0-10 (based on past behavior)
  };
  recommendation: string;
  calculatedAt: Date;
}

export interface ProductivityReport {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  tasksCreated: number;
  tasksCompleted: number;
  goalsActive: number;
  goalsCompleted: number;
  focusTimeTotal: number; // minutes
  completionRate: number; // percentage
  onTimeRate: number; // percentage
  streakDays: number;
  insights: string[];
  recommendations: string[];
  topCategory: string;
  bottleneckAreas: string[];
  aiSummary: string;
  generatedAt: Date;
}

