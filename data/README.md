# Provider Data Management

This directory contains all dummy/mock data used throughout the Provider Profile system. This centralized approach makes it easy to replace dummy data with real backend API calls when ready for production.

## File Structure

### `dummy-providers.ts`
Contains all provider-related data including:
- **DUMMY_PROVIDERS**: Complete provider profiles indexed by provider ID
- **DUMMY_REVIEWS**: Reviews organized by provider ID
- **generateMockAvailability()**: Function to generate availability slots based on business hours
- **Helper functions**: getDummyProvider(), getDummyReviews(), getAllProviderIds()

### `dummy-ui-data.ts` 
Contains UI-related constants and helper functions:
- **Filter Options**: Service categories, gallery categories, review filters
- **Display Configuration**: Badge labels, status configurations, view options
- **Helper Functions**: formatTimeSlot(), getInitials(), getCategoryDisplayName()

## Data Flow

```
Component → useProvider Hook → Dummy Data Files → Mock Data
```

1. **Components** call the `useProvider` hook
2. **useProvider hook** imports functions from dummy data files
3. **Dummy data files** return mock data that simulates API responses
4. **Components** receive data through props (no hardcoded data in components)

## Replacing with Backend API

When ready to connect to a real backend, follow these steps:

### 1. Replace Hook Implementation

In `apps/v4/hooks/use-provider.ts`, replace the dummy data calls:

```typescript
// BEFORE (dummy data)
const providerData = getDummyProvider(providerId);
const reviewsData = getDummyReviews(providerId);
const availabilityData = generateMockAvailability(providerId);

// AFTER (API calls)
const providerData = await api.getProvider(providerId);
const reviewsData = await api.getProviderReviews(providerId);
const availabilityData = await api.getProviderAvailability(providerId);
```

### 2. Update API Functions

Replace the mock functions with real API endpoints:

```typescript
// BEFORE
const bookService = useCallback(async (serviceId: string, slot: { date: string; time: string }) => {
  console.log('Booking service:', { serviceId, slot, providerId });
  // Mock implementation
}, [providerId]);

// AFTER  
const bookService = useCallback(async (serviceId: string, slot: { date: string; time: string }) => {
  await api.bookService({
    providerId,
    serviceId,
    date: slot.date,
    time: slot.time
  });
  await refreshProvider(); // Refresh data after booking
}, [providerId]);
```

### 3. Environment-based Data Loading

You can implement progressive migration using environment variables:

```typescript
const fetchProviderData = useCallback(async () => {
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    // Use dummy data
    const providerData = getDummyProvider(providerId);
    setProvider(providerData);
  } else {
    // Use real API
    const providerData = await api.getProvider(providerId);
    setProvider(providerData);
  }
}, [providerId]);
```

## Data Types

All data follows the TypeScript interfaces defined in `apps/v4/types/provider.ts`:

- `Provider`: Complete provider profile
- `Service`: Individual service offering  
- `Review`: Customer review with optional provider response
- `AvailabilitySlot`: Time slot with availability status
- `GalleryImage`: Portfolio image with category
- `Certification`: Professional certification

## API Endpoint Mapping

When implementing backend APIs, these endpoints will be needed:

| Function | Endpoint | Method | Description |
|----------|----------|---------|-------------|
| `getDummyProvider()` | `/api/providers/{id}` | GET | Get provider profile |
| `getDummyReviews()` | `/api/providers/{id}/reviews` | GET | Get provider reviews |
| `generateMockAvailability()` | `/api/providers/{id}/availability` | GET | Get availability slots |
| `bookService()` | `/api/bookings` | POST | Create new booking |
| `submitReview()` | `/api/reviews` | POST | Submit new review |
| `toggleFavorite()` | `/api/users/favorites` | POST/DELETE | Toggle favorite status |

## Testing Strategy

1. **Unit Tests**: Test components with mock data
2. **Integration Tests**: Test hook behavior with dummy data
3. **E2E Tests**: Test complete user flows
4. **API Tests**: Test real backend integration (when implemented)

## Data Validation

All data should be validated against TypeScript interfaces. Consider adding runtime validation with libraries like Zod:

```typescript
import { z } from 'zod';

const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().min(0).max(5),
  // ... other fields
});

// Validate API responses
const providerData = ProviderSchema.parse(await api.getProvider(providerId));
```

## Performance Considerations

- **Caching**: Implement caching for frequently accessed data
- **Pagination**: Add pagination for reviews and availability
- **Lazy Loading**: Load gallery images and non-critical data on demand
- **Error Handling**: Implement robust error handling and retry logic

## Migration Checklist

- [ ] Replace dummy data calls with API calls in `use-provider.ts`
- [ ] Implement error handling for API failures
- [ ] Add loading states for async operations
- [ ] Implement caching strategy
- [ ] Add data validation
- [ ] Update environment configuration
- [ ] Test with real backend data
- [ ] Remove dummy data files (optional, can keep for testing)

This structure ensures a smooth transition from development with mock data to production with real backend integration. 