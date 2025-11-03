# Bugs

## TypeScript Error in shared-types build

**Location**: `packages/shared-types/src/lib/dtos/client.dtos.ts:2:52`

**Error**:
```
File '/home/williamalexander/ralphinator-mk1/packages/domain/src/index.ts' is not under 'rootDir' '/home/williamalexander/ralphinator-mk1/packages/shared-types'. 'rootDir' is expected to contain all source files.
```

**Impact**: Build fails for shared-types package and all dependent packages (frontend, api)

**Cause**: shared-types package imports from domain package, causing TypeScript rootDir conflict. This appears to be a TypeScript configuration issue where the compiler is including files from outside the expected rootDir.

