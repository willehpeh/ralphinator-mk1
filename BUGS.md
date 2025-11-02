# Bugs

## Bug #1: Test assertions expect string but aggregate returns Email value object

**Status:** Discovered during Step 4 refactoring

**Description:**
Tests in `create-client.handler.spec.ts` and `update-client.handler.spec.ts` expect `getEmail()` to return a string, but the `ClientAggregate` correctly returns an `Email` value object.

**Affected Tests:**
- `packages/testing/src/tests/create-client.handler.spec.ts` (3 tests failing)
- `packages/testing/src/tests/update-client.handler.spec.ts` (3 tests failing)

**Error Message:**
```
AssertionError: expected Email{ value: 'contact@acme.com' } to be 'contact@acme.com' // Object.is equality
```

**Root Cause:**
The tests use `.toBe('email@example.com')` but should use `.toEqual(Email.create('email@example.com'))` or access the Email value object's `value` property.

**Fix:**
Update test assertions to either:
1. Access the value property: `expect(getSavedAggregate().getEmail()?.value).toBe('contact@acme.com')`
2. Compare Email objects: `expect(getSavedAggregate().getEmail()).toEqual(Email.create('contact@acme.com'))`
