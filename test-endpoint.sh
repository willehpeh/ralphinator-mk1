#!/bin/bash

# Test script for GET /api/projects/:id/tasks endpoint

API_URL="http://localhost:3000/api"

echo "=== Testing GET /api/projects/:id/tasks endpoint ==="
echo ""

# Generate unique IDs for testing
CLIENT_ID="test-client-$(date +%s)"
PROJECT_ID="test-project-$(date +%s)"
TASK_ID_1="test-task-1-$(date +%s)"
TASK_ID_2="test-task-2-$(date +%s)"
TASK_ID_3="test-task-3-$(date +%s)"

# Step 1: Create a client (required parent for projects)
echo "Step 1: Creating a test client..."
curl -s -X POST "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -d "{
    \"companyName\": \"Test Company\",
    \"email\": \"test@example.com\",
    \"phone\": \"123-456-7890\",
    \"status\": \"Active\"
  }" | jq '.'
echo ""

# Step 2: Create a project for the client
echo "Step 2: Creating a test project..."
curl -s -X POST "$API_URL/clients/$CLIENT_ID/projects" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Project\",
    \"description\": \"A test project for endpoint testing\",
    \"status\": \"Active\",
    \"startDate\": \"2025-01-01\",
    \"endDate\": \"2025-12-31\"
  }" | jq '.'
echo ""

# Step 3: Create tasks for the project
echo "Step 3: Creating tasks for the project..."

# Task 1 - High priority, not overdue
echo "Creating Task 1 (High priority, active)..."
curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"High priority task for project\",
    \"status\": \"Todo\",
    \"priority\": \"High\",
    \"notes\": \"This is a high priority task\",
    \"deadline\": \"2025-12-31\",
    \"clientId\": \"$CLIENT_ID\",
    \"projectId\": \"$PROJECT_ID\"
  }" | jq '.'
echo ""

# Task 2 - Medium priority, in progress
echo "Creating Task 2 (Medium priority, in progress)..."
curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Medium priority task for project\",
    \"status\": \"InProgress\",
    \"priority\": \"Medium\",
    \"notes\": \"This task is in progress\",
    \"deadline\": \"2025-06-30\",
    \"clientId\": \"$CLIENT_ID\",
    \"projectId\": \"$PROJECT_ID\"
  }" | jq '.'
echo ""

# Task 3 - Urgent, overdue
echo "Creating Task 3 (Urgent, overdue)..."
curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"URGENT overdue task for project\",
    \"status\": \"Todo\",
    \"priority\": \"Urgent\",
    \"notes\": \"This task is overdue!\",
    \"deadline\": \"2025-01-01\",
    \"clientId\": \"$CLIENT_ID\",
    \"projectId\": \"$PROJECT_ID\"
  }" | jq '.'
echo ""

# Step 4: Test the GET /api/projects/:id/tasks endpoint
echo "===================================================="
echo "Step 4: Testing GET /api/projects/$PROJECT_ID/tasks"
echo "===================================================="
echo ""

curl -s "$API_URL/projects/$PROJECT_ID/tasks" | jq '.'
echo ""

# Step 5: Verify filtering works (test with different project)
echo "===================================================="
echo "Step 5: Verifying filtering (testing with non-existent project)"
echo "===================================================="
echo ""

curl -s "$API_URL/projects/non-existent-project/tasks" | jq '.'
echo ""

echo "===================================================="
echo "Test completed!"
echo "===================================================="
