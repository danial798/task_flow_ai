import { adminDb } from './admin';
import { Goal, Task } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';

// Server-side Goal operations (using Admin SDK)
export async function createGoalAdmin(userId: string, goalData: Partial<Goal>): Promise<string> {
  const goalsRef = adminDb.collection('users').doc(userId).collection('goals');
  const docRef = await goalsRef.add({
    ...goalData,
    userId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

export async function createTaskAdmin(userId: string, goalId: string, taskData: Partial<Task>): Promise<string> {
  const tasksRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('tasks');
  
  const docRef = await tasksRef.add({
    ...taskData,
    goalId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  
  return docRef.id;
}

export async function getUserGoalsAdmin(userId: string, statusFilter?: string): Promise<any[]> {
  let query = adminDb.collection('users').doc(userId).collection('goals');
  
  if (statusFilter) {
    query = query.where('status', '==', statusFilter) as any;
  }
  
  const snapshot = await query.orderBy('createdAt', 'desc').get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateGoalAdmin(userId: string, goalId: string, data: Partial<Goal>): Promise<void> {
  const goalRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId);
  
  await goalRef.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deleteGoalAdmin(userId: string, goalId: string): Promise<void> {
  const goalRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId);
  
  await goalRef.delete();
}

export async function getGoalAdmin(userId: string, goalId: string): Promise<any> {
  const goalRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId);
  
  const goalSnap = await goalRef.get();
  
  if (!goalSnap.exists) return null;
  
  return {
    id: goalSnap.id,
    ...goalSnap.data(),
  };
}

export async function getGoalTasksAdmin(userId: string, goalId: string): Promise<any[]> {
  const tasksRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('tasks');
  
  const snapshot = await tasksRef.orderBy('order', 'asc').get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateTaskAdmin(userId: string, goalId: string, taskId: string, data: Partial<Task>): Promise<void> {
  const taskRef = adminDb
    .collection('users')
    .doc(userId)
    .collection('goals')
    .doc(goalId)
    .collection('tasks')
    .doc(taskId);
  
  await taskRef.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
