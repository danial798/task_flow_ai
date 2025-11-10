import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Goal } from '@/types';

export async function exportGoalToPDF(goal: Goal, elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${goal.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return false;
  }
}

export function generateShareableLink(goalId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/share/${goalId}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

export function formatGoalForPrint(goal: Goal): string {
  const completedTasks = goal.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px;">
      <h1 style="color: #2563eb; margin-bottom: 10px;">${goal.title}</h1>
      <p style="color: #666; font-size: 14px; margin-bottom: 30px;">${goal.description}</p>
      
      <div style="margin-bottom: 30px;">
        <p><strong>Category:</strong> ${goal.category}</p>
        <p><strong>Status:</strong> ${goal.status}</p>
        <p><strong>Progress:</strong> ${progress}% (${completedTasks}/${totalTasks} tasks)</p>
        <p><strong>Target Date:</strong> ${new Date(goal.targetDate).toLocaleDateString()}</p>
      </div>

      <h2 style="color: #2563eb; margin-top: 30px; margin-bottom: 15px;">Tasks</h2>
      ${goal.tasks?.map((task, index) => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: ${task.status === 'completed' ? '#10b981' : '#374151'};">
            ${task.status === 'completed' ? '✓' : '○'} ${index + 1}. ${task.title}
          </h3>
          <p style="color: #666; margin: 0;">${task.description}</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">
            Priority: ${task.priority} | Status: ${task.status}
          </p>
        </div>
      `).join('') || '<p>No tasks yet</p>'}
    </div>
  `;
}

