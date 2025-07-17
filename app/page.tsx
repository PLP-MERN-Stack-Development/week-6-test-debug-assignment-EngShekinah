"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TestTube, Bug } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/ErrorBoundary"
import TaskForm from "@/components/TaskForm"
import TaskList from "@/components/TaskList"
import TestingDashboard from "@/components/TestingDashboard"

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTestDashboard, setShowTestDashboard] = useState(false)
  const { toast } = useToast()

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const data = await response.json()
      setTasks((prev) => [...prev, data.task])
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const data = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === id ? data.task : task)))
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">MERN Testing App</h1>
                <p className="text-gray-600">Comprehensive Testing & Debugging Demo</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTestDashboard(!showTestDashboard)}
                  className="flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  {showTestDashboard ? "Hide" : "Show"} Testing Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Simulate a debugging scenario
                    console.log("Current tasks:", tasks)
                    console.log("App state debug info:", {
                      tasksCount: tasks.length,
                      loading,
                      showTestDashboard,
                    })
                  }}
                  className="flex items-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Debug Info
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showTestDashboard && (
            <div className="mb-8">
              <TestingDashboard />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Task
                  </CardTitle>
                  <CardDescription>Add a new task to your list</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskForm onSubmit={createTask} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task List ({tasks.length})</CardTitle>
                  <CardDescription>Manage your tasks with full CRUD operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
