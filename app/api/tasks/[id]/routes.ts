import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (same as in route.ts)
// In a real app, this would be imported from a shared module or database
const tasks: any[] = [
  {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task for testing",
    status: "pending",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/tasks/[id] - Fetch a specific task
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const task = tasks.find((t) => t.id === id)

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      task,
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Validation
    const validStatuses = ["pending", "in-progress", "completed"]
    const validPriorities = ["low", "medium", "high"]

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    if (body.priority && !validPriorities.includes(body.priority)) {
      return NextResponse.json({ success: false, error: "Invalid priority" }, { status: 400 })
    }

    if (body.title && typeof body.title !== "string") {
      return NextResponse.json({ success: false, error: "Title must be a string" }, { status: 400 })
    }

    // Update task
    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    tasks[taskIndex] = updatedTask

    // Log for debugging
    console.log("Updated task:", updatedTask)

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    const deletedTask = tasks[taskIndex]
    tasks.splice(taskIndex, 1)

    // Log for debugging
    console.log("Deleted task:", deletedTask)

    return NextResponse.json({
      success: true,
      task: deletedTask,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
