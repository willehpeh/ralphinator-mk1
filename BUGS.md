# Bugs

## TypeScript Error in ClientAggregate

**Location**: `packages/domain/src/lib/aggregates/client.aggregate.ts:27:7`

**Error**:
```
Type of computed property's value is '(event: ClientStatusChangedDomainEvent) => void', which is not assignable to type 'EventHandler<ClientInformationUpdatedDomainEvent>'.
Types of parameters 'event' and 'event' are incompatible.
Type 'ClientInformationUpdatedDomainEvent' is missing the following properties from type 'ClientStatusChangedDomainEvent': previousStatus, newStatus
```

**Impact**: Build fails for domain package and all dependent packages

**Cause**: Incorrect event handler mapping in CLIENT_EVENT_TYPES - wrong handler is associated with STATUS_CHANGED event type

