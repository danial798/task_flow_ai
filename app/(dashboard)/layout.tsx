'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Target, LayoutDashboard, ListTodo, Brain, BookOpen, LogOut, Menu, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow AI
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed md:static inset-y-0 left-0 z-20 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            mt-[65px] md:mt-0
          `}>
            <nav className="p-4 space-y-2">
              <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
                Dashboard
              </NavLink>
              <NavLink href="/dashboard/goals" icon={<Target className="h-5 w-5" />}>
                My Goals
              </NavLink>
              <NavLink href="/dashboard/tasks" icon={<ListTodo className="h-5 w-5" />}>
                All Tasks
              </NavLink>
              <NavLink href="/dashboard/coach" icon={<Brain className="h-5 w-5" />}>
                AI Coach
              </NavLink>
              <NavLink href="/dashboard/analytics" icon={<BarChart3 className="h-5 w-5" />}>
                Analytics
              </NavLink>
              <NavLink href="/dashboard/reflections" icon={<BookOpen className="h-5 w-5" />}>
                Reflections
              </NavLink>
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 md:hidden mt-[65px]"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-start">
        {icon}
        <span className="ml-2">{children}</span>
      </Button>
    </Link>
  );
}

