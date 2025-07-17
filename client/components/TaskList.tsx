"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Check, Clock, AlertCircle } from "lucide-react"
import type { Task } from "@/app/page"
import TaskForm from "./TaskForm"

interface TaskListProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null)

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task.id)
  }

  const handleUpdate = async (updates: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (editingTask) {
      await onUpdate(editingTask, updates)
      setEditingTask(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-task-list">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="task-list">
      {tasks.map((task) => (
        <Card key={task.id} className="transition-shadow hover:shadow-md">
          {editingTask === task.id ? (
            <CardContent className="pt-6">
              <TaskForm onSubmit={handleUpdate} initialData={task} submitLabel="Update Task" />
              <Button variant="outline" onClick={handleCancelEdit} className="w-full mt-2 bg-transparent">
                Cancel
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant="secondary">{task.status.replace("-", " ")}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                      data-testid={`edit-task-${task.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`delete-task-${task.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {task.description && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                </CardContent>
              )}
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
