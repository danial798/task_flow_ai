import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Goal, Task, ProgressLog, WeeklyReflection, User } from '@/types';

// User operations
export async function createUserProfile(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  
  return {
    uid: userSnap.id,
    ...userSnap.data(),
    createdAt: userSnap.data().createdAt?.toDate(),
  } as User;
}

// Goal operations
export async function createGoal(userId: string, goalData: Partial<Goal>): Promise<string> {
  const goalsRef = collection(db, 'users', userId, 'goals');
  const docRef = await addDoc(goalsRef, {
    ...goalData,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateGoal(userId: string, goalId: string, data: Partial<Goal>) {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  await updateDoc(goalRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteGoal(userId: string, goalId: string) {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  await deleteDoc(goalRef);
}

export async function getGoal(userId: string, goalId: string): Promise<Goal | null> {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  const goalSnap = await getDoc(goalRef);
  
  if (!goalSnap.exists()) return null;
  
  const data = goalSnap.data();
  return {
    id: goalSnap.id,
    ...data,
    startDate: data.startDate?.toDate(),
    targetDate: data.targetDate?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Goal;
}

export function subscribeToGoal(
  userId: string,
  goalId: string,
  callback: (goal: Goal | null) => void
): Unsubscribe {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  
  return onSnapshot(goalRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    
    const data = docSnap.data();
    const goal: Goal = {
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate(),
      targetDate: data.targetDate?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Goal;
    
    callback(goal);
  });
}

export async function getUserGoals(userId: string, statusFilter?: string): Promise<Goal[]> {
  const goalsRef = collection(db, 'users', userId, 'goals');
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (statusFilter) {
    constraints.unshift(where('status', '==', statusFilter));
  }
  
  const q = query(goalsRef, ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate?.toDate(),
    targetDate: doc.data().targetDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Goal[];
}

// Real-time listeners
export function subscribeToUserGoals(
  userId: string,
  callback: (goals: Goal[]) => void,
  statusFilter?: string
): Unsubscribe {
  const goalsRef = collection(db, 'users', userId, 'goals');
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  
  if (statusFilter) {
    constraints.unshift(where('status', '==', statusFilter));
  }
  
  const q = query(goalsRef, ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const goals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate(),
      targetDate: doc.data().targetDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Goal[];
    
    callback(goals);
  });
}

// Task operations
export async function createTask(userId: string, goalId: string, taskData: Partial<Task>): Promise<string> {
  const tasksRef = collection(db, 'users', userId, 'goals', goalId, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    goalId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTask(userId: string, goalId: string, taskId: string, data: Partial<Task>) {
  const taskRef = doc(db, 'users', userId, 'goals', goalId, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function getGoalTasks(userId: string, goalId: string): Promise<Task[]> {
  const tasksRef = collection(db, 'users', userId, 'goals', goalId, 'tasks');
  const q = query(tasksRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate?.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Task[];
}

export function subscribeToGoalTasks(
  userId: string,
  goalId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const tasksRef = collection(db, 'users', userId, 'goals', goalId, 'tasks');
  const q = query(tasksRef, orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Task[];
    
    callback(tasks);
  });
}

// Progress log operations
export async function addProgressLog(
  userId: string,
  goalId: string,
  taskId: string,
  logData: Partial<ProgressLog>
): Promise<string> {
  const logsRef = collection(db, 'users', userId, 'goals', goalId, 'tasks', taskId, 'progressLogs');
  const docRef = await addDoc(logsRef, {
    ...logData,
    taskId,
    userId,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

// Weekly reflection operations
export async function createWeeklyReflection(
  userId: string,
  reflectionData: Partial<WeeklyReflection>
): Promise<string> {
  const reflectionsRef = collection(db, 'users', userId, 'reflections');
  const docRef = await addDoc(reflectionsRef, {
    ...reflectionData,
    userId,
    generatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getUserReflections(userId: string, limitCount: number = 10): Promise<WeeklyReflection[]> {
  const reflectionsRef = collection(db, 'users', userId, 'reflections');
  const q = query(reflectionsRef, orderBy('weekStart', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    weekStart: doc.data().weekStart?.toDate(),
    weekEnd: doc.data().weekEnd?.toDate(),
    generatedAt: doc.data().generatedAt?.toDate(),
  })) as WeeklyReflection[];
}

