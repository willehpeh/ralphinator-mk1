# UC3: Identify Overdue Work - Implementation Tasks

**Status**: In Progress
**Use Case**: Dashboard Overview - UC3: Identify Overdue Work
**Story**: US-DASHBOARD-001

## Overview

Implement the "Overdue Tasks" section of the dashboard that displays tasks past their due date requiring urgent attention.

## Completed Tasks

1. **Create GetOverdueTasksQuery**
   - Created query class implementing IQuery interface
   - Query retrieves all overdue tasks (due date in past, not completed)
   - Will return tasks sorted by due date (oldest first)
   - Location: `packages/application/src/lib/queries/get-overdue-tasks.query.ts`
   - Exported from application module
   - Commit: [pending]
