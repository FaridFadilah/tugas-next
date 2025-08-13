# Redux Integration with JWT Authentication - Implementation Guide

## Overview
Implementasi ini mengubah sistem aplikasi dari menggunakan direct API calls menjadi menggunakan Redux untuk state management dengan JWT authentication yang aman.

## Key Changes

### 1. API Backend Changes

#### Updated Files:
- `pages/api/journal/index.ts`
- `pages/api/journal/[id].ts`
- `lib/auth.ts`

#### Changes Made:
- **JWT Authentication Middleware**: API endpoints sekarang menggunakan `withAuth()` wrapper yang memverifikasi JWT token
- **User ID from Token**: User ID diambil dari JWT token (`req.user.userId`), bukan dari query parameters
- **Security Enhancement**: User hanya bisa mengakses data mereka sendiri (berdasarkan userId dari token)

#### Before:
```typescript
// Menggunakan userId dari query parameter (tidak aman)
const { userId } = req.query;
```

#### After:
```typescript
// Menggunakan userId dari JWT token (aman)
const userId = req.user?.userId;
```

### 2. Redux Store Implementation

#### New Files Created:
- `app/store/store.ts` - Redux store configuration
- `app/store/hooks.ts` - Typed Redux hooks
- `app/store/StoreProvider.tsx` - Redux Provider component
- `app/store/slices/authSlice.ts` - Authentication state management
- `app/store/slices/journalSlice.ts` - Journal state management
- `app/store/slices/uiSlice.ts` - UI state management

#### Features:
- **Centralized State Management**: Semua state aplikasi dikelola di Redux store
- **Async Thunks**: Untuk API calls dengan automatic loading states
- **Type Safety**: Full TypeScript support dengan typed hooks
- **Auto Persistence**: Auth state tersimpan di localStorage dan cookies

### 3. Frontend Integration

#### Updated Files:
- `app/layout.tsx` - Added Redux Provider
- `app/utils/api-new.ts` - Integrated with Redux for error handling

#### New Redux-Powered Pages:
- `app/journal/page-redux.tsx` - Journal listing with Redux
- `app/journal/[id]/page-redux.tsx` - Journal detail with Redux
- `app/journal/new/page-redux.tsx` - New journal entry with Redux
- `app/components/JournalManager.tsx` - Example Redux component
- `app/components/ReduxLoginPage.tsx` - Login with Redux

## Benefits

### 1. Security Improvements
- ✅ JWT-based authentication
- ✅ User data isolation (users only see their own data)
- ✅ No sensitive data in URL parameters
- ✅ Token-based authorization for all API calls

### 2. State Management Benefits
- ✅ Centralized state management
- ✅ Predictable state updates
- ✅ Automatic loading states
- ✅ Error handling
- ✅ Optimistic updates
- ✅ Caching and performance optimization

### 3. Developer Experience
- ✅ Type-safe Redux with TypeScript
- ✅ DevTools support for debugging
- ✅ Consistent error handling
- ✅ Reusable state logic
- ✅ Easy testing

## Usage Examples

### 1. Using Redux in Components

```tsx
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchJournalEntries, createJournalEntry } from "../store/slices/journalSlice";

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { entries, isLoading, error } = useAppSelector(state => state.journal);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchJournalEntries());
    }
  }, [dispatch, isAuthenticated]);

  const handleCreate = async (entryData) => {
    const result = await dispatch(createJournalEntry(entryData));
    if (createJournalEntry.fulfilled.match(result)) {
      // Handle success
    }
  };

  // Component render logic
}
```

### 2. Authentication Flow

```tsx
import { loginUser, logoutUser } from "../store/slices/authSlice";

// Login
const handleLogin = async (credentials) => {
  const result = await dispatch(loginUser(credentials));
  if (loginUser.fulfilled.match(result)) {
    router.push('/dashboard');
  }
};

// Logout
const handleLogout = () => {
  dispatch(logoutUser());
};
```

### 3. API Calls (Now handled by Redux)

```tsx
// Before (direct API call)
const entries = await journalAPI.getEntries();

// After (Redux thunk)
const result = await dispatch(fetchJournalEntries());
```

## Migration Path

### Step 1: Test Current Implementation
1. Start development server: `npm run dev`
2. Login with existing credentials
3. Test journal operations (create, read, update, delete)

### Step 2: Gradual Migration
Replace existing pages one by one:
1. Replace `app/journal/page.tsx` with `app/journal/page-redux.tsx`
2. Replace `app/journal/[id]/page.tsx` with `app/journal/[id]/page-redux.tsx`
3. Replace `app/journal/new/page.tsx` with `app/journal/new/page-redux.tsx`

### Step 3: Clean Up
After migration is complete:
1. Remove old non-Redux components
2. Remove unused API utility functions
3. Update all routes to use Redux versions

## API Documentation

### Authentication Required
All journal API endpoints now require JWT authentication:

```bash
# Headers required for all requests
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Endpoints

#### GET /api/journal
- **Description**: Get all journal entries for authenticated user
- **Authentication**: Required
- **Response**: Array of journal entries
- **Security**: Only returns entries belonging to the authenticated user

#### POST /api/journal
- **Description**: Create new journal entry
- **Authentication**: Required
- **Body**: Journal entry data (userId automatically set from token)
- **Security**: Entry automatically associated with authenticated user

#### GET /api/journal/[id]
- **Description**: Get specific journal entry
- **Authentication**: Required
- **Security**: Only returns entry if it belongs to authenticated user

#### PUT /api/journal/[id]
- **Description**: Update journal entry
- **Authentication**: Required
- **Security**: Only updates entry if it belongs to authenticated user

#### DELETE /api/journal/[id]
- **Description**: Delete journal entry
- **Authentication**: Required
- **Security**: Only deletes entry if it belongs to authenticated user

## Testing Checklist

- [ ] User can register new account
- [ ] User can login with valid credentials
- [ ] User is redirected to login when not authenticated
- [ ] JWT token is stored and used for API calls
- [ ] User can create new journal entries
- [ ] User can view their journal entries (only their own)
- [ ] User can update their journal entries
- [ ] User can delete their journal entries
- [ ] User cannot access other users' data
- [ ] Error handling works properly
- [ ] Loading states work correctly
- [ ] Logout clears all user data

## Environment Variables Required

```env
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-database-connection-string
```

## Troubleshooting

### Common Issues:

1. **"User not authenticated" error**
   - Check if JWT token is being sent in Authorization header
   - Verify token is not expired
   - Check JWT_SECRET environment variable

2. **Redux state not persisting**
   - Verify StoreProvider is wrapping the entire app in layout.tsx
   - Check localStorage for token persistence

3. **API endpoints returning 404**
   - Ensure API files are in correct `pages/api/` directory
   - Check file naming convention matches Next.js API routes

4. **TypeScript errors**
   - Run `npm run build` to check all type errors
   - Ensure all Redux slices export proper types

## Next Steps

1. **Enhanced Security**: Add refresh token mechanism
2. **Offline Support**: Add Redux Persist for offline capabilities
3. **Real-time Updates**: Integrate WebSocket support
4. **Performance**: Add request debouncing and caching
5. **Testing**: Add unit and integration tests
6. **Monitoring**: Add error tracking and analytics
