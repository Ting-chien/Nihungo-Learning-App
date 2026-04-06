# CLAUDE.md

This document defines the development guidelines for this project. Read it in full before starting any work.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Development Principles](#development-principles)
4. [UI Design System](#ui-design-system)
5. [Backend Guidelines — FastAPI](#backend-guidelines--fastapi)
6. [Frontend Guidelines — React](#frontend-guidelines--react)

---

## Project Overview

- **Backend**: Python 3.11+ / FastAPI
- **Frontend**: React 18+ / TypeScript / Tailwind CSS / shadcn/ui
- **Design Philosophy**: Minimal, function-first, consistency over creativity

---

## Project Structure

```
project-root/
├── CLAUDE.md                  ← This file (required reading)
├── docs/
│   ├── design-system.md       ← UI design spec (required reading before any UI changes)
│   └── specification.md       ← Product feature specification
│
├── backend/
│   ├── app/
│   │   ├── main.py            ← FastAPI app entry point
│   │   ├── core/              ← Config, security, dependency injection
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── api/               ← Router layer (routing and input validation only)
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       └── endpoints/
│   │   ├── services/          ← Business logic layer (Use Cases)
│   │   ├── repositories/      ← Data access layer (Repository Pattern)
│   │   ├── models/            ← SQLAlchemy ORM models
│   │   ├── schemas/           ← Pydantic input/output schemas
│   │   └── utils/             ← Pure utility functions, no side effects
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/            ← shadcn/ui components (do not modify core logic)
    │   │   └── features/      ← Business feature components, grouped by feature
    │   ├── hooks/             ← Shared custom hooks across features
    │   ├── services/          ← Centralized API call definitions
    │   ├── stores/            ← Global UI state (Zustand)
    │   ├── types/             ← TypeScript type definitions
    │   ├── lib/               ← Utility functions, shadcn utils
    │   └── pages/             ← Page components (composition only, no business logic)
    ├── tailwind.config.ts
    └── package.json
```

---

## Development Principles

Refer to the Development section in `README.md` first.

### Naming Conventions

| Target | Convention | Example |
|---|---|---|
| Python functions / variables | snake_case | `get_user_by_id` |
| Python classes | PascalCase | `UserService` |
| React components | PascalCase | `UserProfile` |
| React hooks | camelCase with `use` prefix | `useUserProfile` |
| TypeScript types / interfaces | PascalCase | `UserResponse` |
| CSS classes / Tailwind | kebab-case | `user-card` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

### Testing Standards

- Backend Service layer must have unit tests (pytest).
- Frontend custom hooks must have unit tests (Vitest).
- API endpoints must have integration tests.
- Test files should be co-located with source files, named with `.test.` or `_test` suffix.

### Comments & Documentation

- Complex logic must include inline comments explaining **why**, not what.
- All public backend functions must have docstrings.
- TODOs must include context: `# TODO: [reason] description of what needs to be done`.

---

## UI Design System

Refer to `docs/design-system.md` for exact values. The following are the core constraints.

### Component Usage Priority

1. `src/components/ui/` (shadcn/ui) — use first
2. Extend existing components by composing with `cn()`
3. Create a new component (must be placed in `components/features/` with a justification comment)

**Never introduce a second UI component library.**

### Styling Rules

- **Never** hardcode color values (e.g. `#3B82F6`, `text-blue-500`). Always use tokens defined in `tailwind.config.ts`.
- **Never** use inline styles (`style={{ color: 'red' }}`), except when dynamic calculation is unavoidable.
- Spacing follows an 8pt grid: `space-2 (8px)`, `space-4 (16px)`, `space-6 (24px)`, `space-8 (32px)`.
- Border radius must use `rounded-md` as the default. `rounded-full` is only allowed when explicitly approved in the design spec.

### Design Consistency Self-Audit

After completing any UI-related work, verify the following:
- [ ] Only defined color tokens were used — no hardcoded values?
- [ ] Any hardcoded spacing or sizing that should be replaced with tokens?
- [ ] Were existing `components/ui/` components used where applicable?
- [ ] Do new components follow the Presentational / Container separation?

---

## Backend Guidelines — FastAPI

### Layered Architecture (Strictly Enforced)

```
Request → Router (api/) → Service (services/) → Repository (repositories/) → DB
```

- **Router**: Handles routing, receives requests, calls Services, returns responses. No business logic.
- **Service**: All business logic lives here. Never accesses the DB directly — always goes through Repository.
- **Repository**: All database operations are centralized here. No business logic.
- **Schema**: Use `XxxCreate` / `XxxUpdate` for input, `XxxResponse` for output. Strictly separated from ORM models.

### Clean Code Principles

- Functions must have a single responsibility. Consider splitting if a function exceeds 40 lines.
- Name functions with a verb prefix: `get_user`, `create_order`, `validate_token`.
- Avoid magic numbers; define all constants in `core/config.py`.
- All public functions must have type hints and docstrings.

### Error Handling

- Business logic errors must use custom exceptions (defined in `core/exceptions.py`).
- The Router layer catches all exceptions and converts them to `HTTPException` responses.
- The Repository layer only raises data-layer errors — never handles business exceptions.

```python
# ✅ Correct pattern
class UserNotFoundError(AppException):
    pass

# Service layer
async def get_user(user_id: int) -> UserResponse:
    user = await self.user_repo.find_by_id(user_id)
    if not user:
        raise UserNotFoundError(f"User {user_id} not found")
    return UserResponse.model_validate(user)
```

### Dependency Injection

- Use FastAPI `Depends()` to inject Services and Repositories.
- Never instantiate Services or Repositories directly inside a function body.

### Miscellaneous

- API versioning: All endpoints must use the `/api/v1/` prefix.
- Unified response envelope: `{"data": ..., "message": "...", "success": true}`.
- All sensitive configuration must be loaded from environment variables using `pydantic-settings`.

---

## Frontend Guidelines — React

### Component Design Principles

**Presentational / Container Separation**

- **Presentational components** (`components/ui/`, `components/features/*/components/`)
  - Accept only props and are responsible for rendering UI.
  - Must not call APIs directly or access global state.
  - Should be independently displayable in Storybook.

- **Container / Page components** (`pages/`)
  - Responsible for data fetching and state management. No styling logic.
  - Pass data down to Presentational components via props.

```tsx
// ✅ pages/UserPage.tsx — composition only
const UserPage = () => {
  const { user, isLoading } = useUser(id)
  return <UserProfile user={user} isLoading={isLoading} />
}

// ✅ components/features/user/UserProfile.tsx — rendering only
const UserProfile = ({ user, isLoading }: Props) => { ... }
```

### Custom Hooks — Use Case Layer

- Business logic must be extracted into `useXxx` hooks; keep components lean.
- Hook names should clearly express intent: `useUserProfile`, `useOrderCheckout`.
- If a component exceeds 100 lines, consider extracting a hook first.

```tsx
// ❌ Logic scattered inside the component
// ✅ Extracted into a hook
const useUserProfile = (userId: string) => {
  const { data: user, isLoading } = useQuery(...)
  const updateUser = useMutation(...)
  return { user, isLoading, updateUser }
}
```

### Data Fetching & State Management

**Strictly follow this state hierarchy:**

| State Type | Tool | Purpose |
|---|---|---|
| Server state | React Query | API data, caching, synchronization |
| Global UI state | Zustand | theme, sidebar open, modals |
| Local state | useState | Internal component state (forms, toggles) |
| Form state | React Hook Form | All form handling |

- **Never** use `useEffect` to manually manage API fetches — always use React Query.
- **Never** store server data in Zustand.
- Keep state as local as possible; only lift to global scope when necessary.

### Centralized API Layer

All API calls must be defined in `src/services/`. Components must never use `fetch` or `axios` directly.

```ts
// src/services/userService.ts
export const userService = {
  getUser: (id: string): Promise<UserResponse> =>
    apiClient.get(`/users/${id}`),
  updateUser: (id: string, data: UpdateUserDto): Promise<UserResponse> =>
    apiClient.put(`/users/${id}`, data),
}
```

### TypeScript Standards

- All API response types must be defined in `src/types/`, aligned with backend Pydantic schemas.
- **Never** use `any`. Use `unknown` with proper type narrowing when necessary.
- Props interfaces must be explicitly defined — avoid using `object` or spread types.
- If a component has more than 5 props, consider refactoring with composition or the children pattern.


*Last updated: Sync this document after every significant architectural decision.*