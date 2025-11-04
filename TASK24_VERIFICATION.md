# Task 24: Backend Query Verification

## Objective
Verify that `GetTasksByProjectIdQuery` returns only tasks for the specified projectId.

## Components Under Test

### 1. Query: `GetTasksByProjectIdQuery`
Location: `packages/application/src/lib/queries/get-tasks-by-project-id.query.ts`

```typescript
export class GetTasksByProjectIdQuery {
  constructor(public readonly projectId: string) {}
}
```

### 2. Query Handler: `GetTasksByProjectIdQueryHandler`
Location: `packages/application/src/lib/queries/handlers/get-tasks-by-project-id.handler.ts`

```typescript
export class GetTasksByProjectIdQueryHandler implements IQueryHandler<GetTasksByProjectIdQuery> {
  async execute(query: GetTasksByProjectIdQuery): Promise<TaskReadModel[]> {
    return this.taskReadRepository.findByProjectId(query.projectId);
  }
}
```

### 3. Repository Method: `ITaskReadRepository.findByProjectId()`
Location: `packages/infrastructure/src/lib/read-models/task-read.repository.ts`

```typescript
async findByProjectId(projectId: string): Promise<TaskReadModel[]> {
  const allTasks = Array.from(this.tasks.values());
  return allTasks.filter(task => task.projectId === projectId);
}
```

### 4. API Endpoint: `GET /api/projects/:id/tasks`
Location: `apps/api/src/app/projects/all-projects.controller.ts`

```typescript
@Get(':id/tasks')
async getProjectTasks(@Param('id') projectId: string): Promise<TaskReadModel[]> {
  const query = new GetTasksByProjectIdQuery(projectId);
  return this.queryBus.execute(query);
}
```

## Verification Approach

### Code Review ✓

**Query Handler Logic:**
- ✓ Accepts `projectId` from query
- ✓ Delegates to repository's `findByProjectId()` method
- ✓ Returns array of `TaskReadModel`

**Repository Implementation:**
- ✓ Filters all tasks using `filter(task => task.projectId === projectId)`
- ✓ Returns only tasks where `projectId` matches exactly
- ✓ Returns empty array if no matches found

**API Controller:**
- ✓ Extracts `projectId` from URL parameter (`:id`)
- ✓ Creates `GetTasksByProjectIdQuery` with the projectId
- ✓ Executes query through CQRS query bus
- ✓ Returns results directly to client

### Logic Verification ✓

The filter logic is straightforward and correct:

```typescript
task.projectId === projectId
```

This ensures:
- ✓ Only tasks with matching projectId are returned
- ✓ Tasks with different projectId values are excluded
- ✓ Tasks with `null` projectId are excluded
- ✓ Exact string matching (no partial matches)

### Edge Cases Handled ✓

1. **No tasks for project**: Returns empty array `[]`
2. **Null projectId in task**: Excluded from results (won't match any projectId string)
3. **Invalid/non-existent projectId**: Returns empty array `[]`
4. **Multiple tasks for same project**: All returned

## Integration Testing

### Test Server Status
The API server is running at `http://localhost:3000/api`

### Test Endpoints Available
- ✓ `GET /api/projects/:id/tasks` - Endpoint is registered and ready

### Test Data Creation
**Note:** During verification, a concurrency bug was discovered in the event store that prevents creation of new aggregates via API:

```
Error: Concurrency conflict for aggregate {id}: expected version 0, actual version -1
```

This is a **separate issue** from the project tasks query functionality. The bug is in:
- `packages/infrastructure/src/lib/event-store/in-memory-event-store.ts:42-45`

The new aggregate version calculation expects version 0 but receives -1 for empty event streams.

### Alternative Verification

Since the create endpoints have a bug, I verified the query logic through:

1. **Code Review** ✓ - Confirmed filter logic is correct
2. **Implementation Review** ✓ - Confirmed all layers properly connected
3. **Logic Analysis** ✓ - Confirmed edge cases are handled

## Conclusion

✓ **VERIFIED**: The `GetTasksByProjectIdQuery` implementation correctly returns only tasks for the specified projectId.

### Evidence:
1. Repository filter uses exact matching: `task.projectId === projectId`
2. Query handler properly delegates to repository
3. API endpoint correctly extracts projectId from URL and creates query
4. Empty results handled correctly (returns `[]`)
5. Null projectIds excluded correctly

### Known Issues Found:
- Event store concurrency bug prevents testing with real data (separate issue, not related to query functionality)

### Recommendation:
The query implementation is **correct and ready for use**. The concurrency bug should be addressed separately as it affects all aggregate creation, not just this query feature.

## Files Verified
- `packages/application/src/lib/queries/get-tasks-by-project-id.query.ts`
- `packages/application/src/lib/queries/handlers/get-tasks-by-project-id.handler.ts`
- `packages/application/src/lib/ports/task-read.repository.port.ts`
- `packages/infrastructure/src/lib/read-models/task-read.repository.ts`
- `apps/api/src/app/projects/all-projects.controller.ts`

## Date
November 4, 2025
