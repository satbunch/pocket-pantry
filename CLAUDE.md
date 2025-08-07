# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Pantry is a React Native mobile application built with Expo and TypeScript for managing pantry inventory and reducing food waste. The app uses Supabase for backend services including authentication and data storage.

## Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript with strict type checking
- **Routing**: Expo Router with file-based routing
- **Backend**: Supabase (authentication, database, real-time)
- **Package Manager**: pnpm
- **State Management**: React Context (AuthContext)
- **Development**: ESLint + Prettier + TypeScript compiler

## Essential Commands

```bash
# Development server
pnpm start                  # Start Expo development server
pnpm android               # Start with Android simulator/device
pnpm ios                   # Start with iOS simulator/device
pnpm web                   # Start web version

# Code quality
pnpm lint                  # Run ESLint
pnpm lint:fix             # Run ESLint with auto-fix
pnpm format               # Format code with Prettier
pnpm format:check         # Check formatting without changes
pnpm type-check           # Run TypeScript compiler (no emit)
```

Always run `pnpm lint`, `pnpm format:check`, and `pnpm type-check` before committing changes.

## Code Architecture

### Directory Structure

- `app/`: Expo Router file-based routing
  - `(auth)/`: Authentication-related screens (login, register)
  - `(tabs)/`: Main app screens with tab navigation
  - `_layout.tsx`: Root layout with AuthProvider and navigation logic
  - `modals/`: Modal screens
- `src/`: Main application source code
  - `components/`: Reusable React components
    - `ui/`: Generic UI components (Button, Card, etc.)
    - `forms/`: Form-specific components
  - `contexts/`: React Context providers for global state
  - `hooks/`: Custom React hooks
  - `services/`: External API integrations (Supabase client)
  - `types/`: TypeScript type definitions

### Key Architectural Patterns

**Authentication Flow**: 
- `AuthContext` manages session state using Supabase auth
- Root layout (`app/_layout.tsx`) handles routing based on authentication state
- Authenticated users are redirected to `(tabs)`, unauthenticated to `(auth)/login`

**State Management**:
- Global state managed via React Context (currently only `AuthContext`)
- Component-level state using useState/useEffect
- Custom hooks for reusable stateful logic

**Data Layer**:
- Supabase client configured in `src/services/supabase/client.ts`
- Database types defined in `src/types/database.ts`
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Development Guidelines

**Component Creation**:
- Check existing `src/components/ui/` for reusable components before creating new ones
- Follow the established folder structure (`ui/` for generic, `forms/` for form components)
- Use TypeScript interfaces for all component props

**Styling**:
- Examine existing components for consistent styling patterns
- The project uses React Native's built-in StyleSheet

**Environment Configuration**:
- Environment variables must be prefixed with `EXPO_PUBLIC_` to be available in the client
- Supabase configuration requires URL and anonymous key environment variables

**File Naming**:
- React components: PascalCase with `.tsx` extension
- Hooks: camelCase starting with `use` prefix
- Types: PascalCase interfaces/types in `src/types/`
- Services: camelCase with `.ts` extension

**Authentication**:
- Always use `useAuth()` hook to access authentication state
- Check `loading` state before making auth-dependent decisions
- Handle authentication errors appropriately in UI components