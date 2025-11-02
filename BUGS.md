# Bugs

## Frontend Module Boundary Violations

**Error:** Multiple frontend files violate module boundaries by depending on libs not tagged with "scope:frontend"

**Affected Files:**
- `/apps/frontend/src/app/clients/change-status-form.component.ts:7`
- `/apps/frontend/src/app/clients/client-form.component.ts:10`
- `/apps/frontend/src/app/clients/client-list.component.ts:12`
- `/apps/frontend/src/app/clients/client.constants.ts:1`
- `/apps/frontend/src/app/clients/clients.service.ts:5`
- `/apps/frontend/src/app/clients/store/clients.actions.ts:2`

**ESLint Rule:** `@nx/enforce-module-boundaries`

**Details:** Frontend is trying to import from packages that should be isolated (likely importing from domain/application packages directly)

## Frontend Accessibility Issues

**Error:** Click events without keyboard handlers and non-focusable interactive elements

**Affected File:** `/apps/frontend/src/app/clients/client-list.component.ts:97`

**ESLint Rules:**
- `@angular-eslint/template/click-events-have-key-events`
- `@angular-eslint/template/interactive-supports-focus`

## Minor Warnings

**Unused Imports:**
- `/apps/frontend/src/app/clients/change-status-form.component.ts:1` - 'signal' is defined but never used
- `/apps/frontend/src/app/clients/client-list.component.spec.ts:2` - 'ComponentFixture' is defined but never used

**Non-null Assertion:**
- `/apps/frontend/src/app/clients/client-form.component.ts:280` - Forbidden non-null assertion
