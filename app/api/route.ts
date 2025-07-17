import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In a real app, this would be a database
let tasks: any[] = [
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

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({
      success: true,
      tasks: tasks,
      count: tasks.length,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ success: false, error: "Title is required and must be a string" }, { status: 400 })
    }

    // Create new task
    const newTask = {
      id: Date.now().toString(),
      title: body.title.trim(),
      description: body.description || "",
      status: body.status || "pending",
      priority: body.priority || "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Validate status and priority
    const validStatuses = ["pending", "in-progress", "completed"]
    const validPriorities = ["low", "medium", "high"]

    if (!validStatuses.includes(newTask.status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    if (!validPriorities.includes(newTask.priority)) {
      return NextResponse.json({ success: false, error: "Invalid priority" }, { status: 400 })
    }

    tasks.push(newTask)

    // Log for debugging
    console.log("Created new task:", newTask)

    return NextResponse.json(
      {
        success: true,
        task: newTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}

// DELETE /api/tasks - Delete all tasks (for testing)
export async function DELETE() {
  try {
    const deletedCount = tasks.length
    tasks = []

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} tasks`,
      deletedCount,
    })
  } catch (error) {
    console.error("Error deleting all tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to delete tasks" }, { status: 500 })
  }
}
