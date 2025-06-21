# Fix Proposal for Issue #24 — IDOR on /api/users/:id/avatar

## Summary

This document proposes a fix for the Insecure Direct Object Reference (IDOR) vulnerability reported in Issue #24. The issue allows any authenticated user to delete the avatar of another user by modifying the `userId` in the URL.

---

## Root Cause

The endpoint `/api/users/:id/` lacks an ownership check between the `userId` in the URL and the authenticated user in the session/token. The backend trusts the user-provided `:id` instead of validating it.

---

## Proposed Fix

Introduce a centralized ownership validation helper that can be reused across sensitive user endpoints.

### 🔧 Helper Function (utils/validate-ownership.ts)

```ts
import { ForbiddenException } from '@nestjs/common';

export function validateOwnership(requestUserId: number, paramUserId: number) {
  if (requestUserId !== paramUserId) {
    throw new ForbiddenException('Unauthorized: You do not have permission!');
  }
}
