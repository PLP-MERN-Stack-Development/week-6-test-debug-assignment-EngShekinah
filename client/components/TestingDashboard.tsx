"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TestTube, CheckCircle, XCircle, Clock, Play, Bug } from "lucide-react"

interface TestResult {
  name: string
  status: "passed" | "failed" | "pending"
  duration: number
  error?: string
}

interface TestSuite {
  name: string
  tests: TestResult[]
  coverage: number
}

export default function TestingDashboard() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // Mock test data - in a real app, this would come from your test runner
  const mockTestSuites: TestSuite[] = [
    {
      name: "Unit Tests - Components",
      coverage: 85,
      tests: [
        { name: "TaskForm renders correctly", status: "passed", duration: 45 },
        { name: "TaskForm validates required fields", status: "passed", duration: 32 },
        { name: "TaskList displays tasks", status: "passed", duration: 28 },
        { name: "TaskList handles empty state", status: "passed", duration: 15 },
        {
          name: "ErrorBoundary catches errors",
          status: "failed",
          duration: 67,
          error: "Expected error boundary to display fallback UI",
        },
      ],
    },
    {
      name: "Integration Tests - API",
      coverage: 92,
      tests: [
        { name: "GET /api/tasks returns tasks", status: "passed", duration: 156 },
        { name: "POST /api/tasks creates task", status: "passed", duration: 203 },
        { name: "PUT /api/tasks/:id updates task", status: "passed", duration: 178 },
        { name: "DELETE /api/tasks/:id removes task", status: "passed", duration: 134 },
        { name: "API handles validation errors", status: "passed", duration: 89 },
      ],
    },
    {
      name: "End-to-End Tests",
      coverage: 78,
      tests: [
        { name: "User can create a new task", status: "passed", duration: 2340 },
        { name: "User can edit existing task", status: "passed", duration: 1890 },
        { name: "User can delete task", status: "passed", duration: 1456 },
        { name: "Error handling works correctly", status: "pending", duration: 0 },
      ],
    },
  ]

  const runTests = async () => {
    setIsRunning(true)
    setTestSuites([])

    // Simulate running tests
    for (let i = 0; i < mockTestSuites.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTestSuites((prev) => [...prev, mockTestSuites[i]])
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)
  const passedTests = testSuites.reduce(
    (acc, suite) => acc + suite.tests.filter((test) => test.status === "passed").length,
    0,
  )
  const failedTests = testSuites.reduce(
    (acc, suite) => acc + suite.tests.filter((test) => test.status === "failed").length,
    0,
  )
  const averageCoverage =
    testSuites.length > 0 ? testSuites.reduce((acc, suite) => acc + suite.coverage, 0) / testSuites.length : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Testing Dashboard
            </CardTitle>
            <CardDescription>Comprehensive testing overview for MERN application</CardDescription>
          </div>
          <Button onClick={runTests} disabled={isRunning} className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Summary */}
        {testSuites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{averageCoverage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
          </div>
        )}

        {/* Test Suites */}
        {testSuites.map((suite, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{suite.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Coverage: {suite.coverage}%</Badge>
                  <Progress value={suite.coverage} className="w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.duration > 0 && <span className="text-xs text-gray-500">{test.duration}ms</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show errors for failed tests */}
              {suite.tests.some((test) => test.error) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Test Failures:</span>
                  </div>
                  {suite.tests
                    .filter((test) => test.error)
                    .map((test, errorIndex) => (
                      <div key={errorIndex} className="text-xs text-red-700 font-mono">
                        {test.name}: {test.error}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {isRunning && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Running test suites...</p>
          </div>
        )}

        {testSuites.length === 0 && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click "Run All Tests" to start testing</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
