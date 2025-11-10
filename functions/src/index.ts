import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Weekly Reflection Generator
// Runs every Monday at 9 AM
export const generateWeeklyReflections = functions.pubsub
  .schedule('0 9 * * 1')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    
    try {
      // Get all users
      const usersSnapshot = await db.collection('users').get();
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        // Get user's goals and tasks from the past week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const goalsSnapshot = await db
          .collection(`users/${userId}/goals`)
          .where('updatedAt', '>=', weekAgo)
          .get();
        
        if (goalsSnapshot.empty) continue;
        
        let totalTasks = 0;
        let completedTasks = 0;
        const achievements: string[] = [];
        
        for (const goalDoc of goalsSnapshot.docs) {
          const tasksSnapshot = await db
            .collection(`users/${userId}/goals/${goalDoc.id}/tasks`)
            .get();
          
          tasksSnapshot.forEach(taskDoc => {
            totalTasks++;
            const task = taskDoc.data();
            if (task.status === 'completed') {
              completedTasks++;
              if (task.updatedAt.toDate() >= weekAgo) {
                achievements.push(task.title);
              }
            }
          });
        }
        
        // Calculate productivity score
        const productivityScore = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
        
        // Create reflection document
        await db.collection(`users/${userId}/reflections`).add({
          weekStart: admin.firestore.Timestamp.fromDate(weekAgo),
          weekEnd: admin.firestore.Timestamp.now(),
          summary: `This week you completed ${completedTasks} out of ${totalTasks} tasks.`,
          achievements: achievements.slice(0, 5),
          challenges: [],
          recommendations: generateRecommendations(productivityScore),
          goalsCompleted: 0,
          tasksCompleted: completedTasks,
          productivityScore,
          generatedAt: admin.firestore.Timestamp.now(),
        });
      }
      
      console.log('Weekly reflections generated successfully');
    } catch (error) {
      console.error('Error generating weekly reflections:', error);
    }
  });

// Helper function to generate recommendations
function generateRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      'Excellent work! Keep up the momentum.',
      'Consider taking on more challenging goals.',
      'Share your productivity strategies with others.',
    ];
  } else if (score >= 60) {
    return [
      'Good progress! Try breaking tasks into smaller steps.',
      'Set specific time blocks for focused work.',
      'Review your goals to ensure they\'re still aligned with your priorities.',
    ];
  } else {
    return [
      'Don\'t be discouraged! Start with one small task today.',
      'Consider simplifying your goals or extending deadlines.',
      'Reach out to your AI coach for personalized support.',
    ];
  }
}

// Cleanup old data
// Runs daily at 2 AM
export const cleanupOldData = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    
    try {
      // Delete reflections older than 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const usersSnapshot = await db.collection('users').get();
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        const oldReflections = await db
          .collection(`users/${userId}/reflections`)
          .where('weekStart', '<', admin.firestore.Timestamp.fromDate(sixMonthsAgo))
          .get();
        
        const batch = db.batch();
        oldReflections.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      }
      
      console.log('Old data cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  });

// Update goal completion percentage when task status changes
export const updateGoalProgress = functions.firestore
  .document('users/{userId}/goals/{goalId}/tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const { userId, goalId } = context.params;
    const db = admin.firestore();
    
    try {
      // Get all tasks for this goal
      const tasksSnapshot = await db
        .collection(`users/${userId}/goals/${goalId}/tasks`)
        .get();
      
      let total = 0;
      let completed = 0;
      
      tasksSnapshot.forEach(doc => {
        total++;
        if (doc.data().status === 'completed') {
          completed++;
        }
      });
      
      const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      // Update goal
      await db.doc(`users/${userId}/goals/${goalId}`).update({
        completionPercentage,
        updatedAt: admin.firestore.Timestamp.now(),
      });
      
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  });

