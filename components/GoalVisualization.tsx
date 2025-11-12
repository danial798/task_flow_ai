'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Goal, Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, CheckCircle2, Circle, Clock } from 'lucide-react';

interface GoalVisualizationProps {
  goal: Goal;
}

export function GoalVisualization({ goal }: GoalVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    generateFlowChart();
  }, [goal]);

  const generateFlowChart = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Root node (Goal)
    const goalNode: Node = {
      id: `goal-${goal.id}`,
      type: 'default',
      data: {
        label: (
          <div className="px-4 py-2 text-center">
            <div className="font-bold text-lg mb-1">{goal.title}</div>
            <div className="text-xs text-muted-foreground">
              {goal.completionPercentage}% complete
            </div>
          </div>
        ),
      },
      position: { x: 250, y: 0 },
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: '2px solid #667eea',
        borderRadius: '12px',
        width: 300,
        fontSize: '14px',
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
    newNodes.push(goalNode);

    // Task nodes
    const tasks = goal.tasks || [];
    const cols = Math.ceil(Math.sqrt(tasks.length));
    const spacing = { x: 300, y: 150 };

    tasks.forEach((task, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const taskNode: Node = {
        id: `task-${task.id}`,
        type: 'default',
        data: {
          label: (
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-1">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : task.status === 'in-progress' ? (
                  <Clock className="w-4 h-4 text-blue-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-semibold text-sm">{task.title}</span>
              </div>
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                </div>
              )}
            </div>
          ),
        },
        position: {
          x: col * spacing.x + (cols > 1 ? 0 : 100),
          y: 150 + row * spacing.y,
        },
        style: {
          background: task.status === 'completed' ? '#f0fdf4' : task.status === 'in-progress' ? '#eff6ff' : '#f9fafb',
          border: `2px solid ${
            task.status === 'completed' ? '#22c55e' : task.status === 'in-progress' ? '#3b82f6' : '#d1d5db'
          }`,
          borderRadius: '8px',
          width: 250,
          fontSize: '12px',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
      newNodes.push(taskNode);

      // Edge from goal to task
      newEdges.push({
        id: `edge-goal-${task.id}`,
        source: `goal-${goal.id}`,
        target: `task-${task.id}`,
        animated: task.status === 'in-progress',
        style: {
          stroke: task.status === 'completed' ? '#22c55e' : task.status === 'in-progress' ? '#3b82f6' : '#d1d5db',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: task.status === 'completed' ? '#22c55e' : task.status === 'in-progress' ? '#3b82f6' : '#d1d5db',
        },
      });

      // Edges for task dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        task.dependencies.forEach((depId) => {
          newEdges.push({
            id: `edge-${depId}-${task.id}`,
            source: `task-${depId}`,
            target: `task-${task.id}`,
            animated: false,
            style: {
              stroke: '#f59e0b',
              strokeWidth: 2,
              strokeDasharray: '5,5',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#f59e0b',
            },
          });
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  if (!goal.tasks || goal.tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Network className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No tasks to visualize yet. Create some tasks to see your goal map!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Goal Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            Completed
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            In Progress
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            Pending
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-orange-500" style={{ borderTop: '2px dashed #f59e0b' }} />
            Dependency
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

