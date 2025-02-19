# Development Rules and Guidelines

## Code Quality and Structure

1. **Component Structure**

   - Keep components in their respective feature folders
   - Follow the pattern: `src/components/dashboard/[feature]/[component]`
   - Maintain separation between UI components and logic

2. **Type Safety**

   - Always define TypeScript interfaces for props and API responses
   - Use strict type checking
   - Keep shared types in `src/types/types.ts`

3. **State Management**
   - Use local state for UI-only state
   - Use context for shared state (auth, theme, etc.)
   - Keep API state separate from UI state

## API Integration Guidelines

### Required Endpoints

1. **Authentication**

   ```typescript
   POST / api / v1 / auth / login;
   POST / api / v1 / auth / admin - login;
   POST / api / v1 / auth / verify - login;
   PATCH / api / v1 / auth / initiate - reset - password;
   POST / api / v1 / auth / refresh - token;
   ```

2. **Users Management**

   ```typescript
   GET / api / v1 / users;
   GET / api / v1 / users / { id };
   GET / api / v1 / users / drivers;
   POST / api / v1 / users / suspend;
   GET / api / v1 / users / audit - logs;
   ```

3. **Rides Management**

   ```typescript
   GET / api / v1 / rides;
   GET / api / v1 / rides / analytics;
   GET / api / v1 / rides / history;
   GET / api / v1 / rides / fleet;
   ```

4. **Transactions**

   ```typescript
   GET / api / v1 / transactions;
   GET / api / v1 / transactions / topup - history;
   GET / api / v1 / transactions / issues;
   POST / api / v1 / transactions / refund;
   ```

5. **Revenue**
   ```typescript
   GET / api / v1 / revenue / overview;
   GET / api / v1 / revenue / analytics;
   GET / api / v1 / revenue / reports;
   ```

### Error Handling

1. **API Error States**

   ```typescript
   interface ApiError {
     status: number;
     message: string;
     code?: string;
   }
   ```

2. **Fallback UI**
   - Always implement error boundaries
   - Show meaningful error messages
   - Provide retry mechanisms
   - Use skeleton loaders during loading

## UI Maintenance

1. **Component Fallbacks**

   - Implement skeleton loaders for all data-dependent components
   - Use placeholder data when APIs are unavailable
   - Maintain consistent layout even without data

2. **Design System**
   - Use existing UI components from `@/components/ui/base`
   - Maintain consistent spacing using theme variables
   - Follow the established color scheme

## Testing Guidelines

1. **Component Testing**

   - Test UI components in isolation
   - Mock API calls
   - Test error states and loading states

2. **Integration Testing**
   - Test component integration
   - Verify data flow
   - Test error handling

## Development Workflow

1. **Feature Development**

   ```bash
   # Create feature branch
   git checkout -b feature/[feature-name]

   # Run type checking
   pnpm run type-check

   # Run tests
   pnpm run test

   # Build project
   pnpm run build
   ```

2. **API Integration**
   - Create API service files in `src/services/api`
   - Use axios instances with interceptors
   - Implement retry logic for failed requests

## Mock Data Guidelines

1. **Create realistic mock data**

   ```typescript
   // Example mock data structure
   const mockData = {
     users: [],
     rides: [],
     transactions: [],
     revenue: {},
   };
   ```

2. **Use consistent mock data across components**

## Environment Setup

```env
NEXT_PUBLIC_API_BASE_URL=http://your-api-url
NEXT_PUBLIC_FIREBASE_CONFIG=your-firebase-config
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Deployment Checklist

1. **Pre-deployment**

   - Run type checking
   - Run all tests
   - Build project
   - Check environment variables

2. **Post-deployment**
   - Verify API connections
   - Test critical flows
   - Monitor error rates

## Troubleshooting Guide

1. **Common Issues**

   - API connection issues
   - Type errors
   - Build failures
   - State management problems

2. **Solutions**
   - Check API endpoints
   - Verify type definitions
   - Clear build cache
   - Check state updates
