# API Integration Guide

This document provides detailed information about the API integration in BookingHub, including endpoints, authentication, error handling, and best practices.

## 🔐 Authentication

### JWT Token Management

The application uses JWT tokens for authentication with automatic refresh capabilities.

#### Token Storage
```typescript
// Tokens are stored in localStorage
localStorage.setItem('access_token', accessToken)
localStorage.setItem('refresh_token', refreshToken)
```

#### Automatic Token Refresh
```typescript
// API interceptor automatically handles token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshToken = getStoredRefreshToken()
      if (refreshToken) {
        try {
          const response = await authService.refresh()
          setTokens(response.data.access_token, response.data.refresh_token)
          // Retry original request
          return api(error.config)
        } catch (refreshError) {
          // Redirect to login on refresh failure
          clearTokens()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)
```

### Authentication Endpoints

#### Login
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "business_id": "business-456"
  }
}
```

#### Register
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Response: Same as login response
```

#### Refresh Token
```typescript
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: Same as login response
```

## 📊 Service Management

### Service Endpoints

#### Get All Services
```typescript
GET /api/services
Authorization: Bearer <access_token>

Response:
{
  "items": [
    {
      "id": "service-123",
      "business_id": "business-456",
      "name": "Haircut",
      "description": "Professional haircut service",
      "duration": 30,
      "price": 25.00,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}
```

#### Create Service (Admin Only)
```typescript
POST /api/services
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Service",
  "description": "Service description",
  "duration": 60,
  "price": 50.00
}

Response: Created service object
```

#### Update Service (Admin Only)
```typescript
PUT /api/services/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Service Name",
  "price": 75.00
}

Response: Updated service object
```

#### Delete Service (Admin Only)
```typescript
DELETE /api/services/:id
Authorization: Bearer <access_token>

Response: 204 No Content
```

## 📅 Booking Management

### Booking Endpoints

#### Get User Bookings
```typescript
GET /api/bookings
Authorization: Bearer <access_token>

Response:
{
  "items": [
    {
      "id": "booking-123",
      "user_id": "user-123",
      "business_id": "business-456",
      "service_id": "service-123",
      "time_slot_id": "slot-123",
      "status": "Confirmed",
      "service_name": "Haircut",
      "start_time": "2024-01-15T10:00:00Z",
      "end_time": "2024-01-15T10:30:00Z",
      "notes": "Customer notes",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "service": { /* service object */ },
      "time_slot": { /* time slot object */ }
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}
```

#### Create Booking
```typescript
POST /api/bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "service_id": "service-123",
  "time_slot_id": "slot-123",
  "notes": "Customer notes"
}

Response: Created booking object
```

#### Cancel Booking
```typescript
PATCH /api/bookings/:id/cancel
Authorization: Bearer <access_token>

Response: Updated booking object with "Cancelled" status
```

#### Get All Bookings (Admin Only)
```typescript
GET /api/admin/bookings
Authorization: Bearer <access_token>

Response: Same as user bookings but includes all bookings
```

## ⏰ Time Slot Management

### Time Slot Endpoints

#### Get Available Time Slots
```typescript
GET /api/services/:id/time-slots
Authorization: Bearer <access_token>

Response:
{
  "items": [
    {
      "id": "slot-123",
      "service_id": "service-123",
      "business_id": "business-456",
      "start_time": "2024-01-15T10:00:00Z",
      "end_time": "2024-01-15T10:30:00Z",
      "is_available": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}
```

#### Create Time Slot (Admin Only)
```typescript
POST /api/time-slots
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "service_id": "service-123",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T10:30:00Z"
}

Response: Created time slot object
```

#### Delete Time Slot (Admin Only)
```typescript
DELETE /api/time-slots/:id
Authorization: Bearer <access_token>

Response: 204 No Content
```

## 🔧 API Client Usage

### Basic Usage
```typescript
import { api } from '@/lib/api'

// Make authenticated requests
const response = await api.get('/api/bookings')
const bookings = response.data.items
```

### Error Handling
```typescript
try {
  const response = await api.post('/api/bookings', bookingData)
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    // Handle validation errors
    const errors = error.response.data.errors
  } else if (error.response?.status === 401) {
    // Handle authentication errors (handled automatically)
  } else if (error.response?.status === 403) {
    // Handle authorization errors
  } else {
    // Handle other errors
    console.error('API Error:', error.message)
  }
}
```

### Custom Hooks
```typescript
// useBooking hook example
export const useBooking = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/api/bookings')
      setBookings(response.data.items)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { bookings, isLoading, error, fetchBookings }
}
```

## 🚨 Error Handling

### Common Error Responses

#### Validation Errors (400)
```json
{
  "error": {
    "message": "Validation failed",
    "code": 400,
    "errors": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

#### Authentication Errors (401)
```json
{
  "error": {
    "message": "Invalid credentials",
    "code": 401
  }
}
```

#### Authorization Errors (403)
```json
{
  "error": {
    "message": "Insufficient permissions",
    "code": 403
  }
}
```

#### Not Found Errors (404)
```json
{
  "error": {
    "message": "Resource not found",
    "code": 404
  }
}
```

### Error Handling Best Practices

1. **Always check response status** before processing data
2. **Handle network errors** gracefully
3. **Show user-friendly error messages**
4. **Log errors** for debugging
5. **Implement retry logic** for transient failures

```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return `Validation error: ${data.error.message}`
      case 401:
        return 'Please log in again'
      case 403:
        return 'You do not have permission to perform this action'
      case 404:
        return 'The requested resource was not found'
      case 500:
        return 'Server error. Please try again later'
      default:
        return 'An unexpected error occurred'
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection'
  } else {
    // Other error
    return 'An unexpected error occurred'
  }
}
```

## 🔄 Data Synchronization

### Real-time Updates
For real-time updates, consider implementing WebSocket connections:

```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('ws://localhost:3000/ws')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  
  switch (data.type) {
    case 'BOOKING_UPDATED':
      // Update booking in local state
      updateBooking(data.booking)
      break
    case 'NEW_BOOKING':
      // Add new booking to list
      addBooking(data.booking)
      break
    case 'TIME_SLOT_UPDATED':
      // Update time slot availability
      updateTimeSlot(data.timeSlot)
      break
  }
}
```

### Optimistic Updates
Implement optimistic updates for better UX:

```typescript
const createBooking = async (bookingData) => {
  // Optimistically add booking to UI
  const optimisticBooking = {
    ...bookingData,
    id: 'temp-' + Date.now(),
    status: 'Pending'
  }
  setBookings(prev => [...prev, optimisticBooking])
  
  try {
    const response = await api.post('/api/bookings', bookingData)
    // Replace optimistic booking with real one
    setBookings(prev => prev.map(b => 
      b.id === optimisticBooking.id ? response.data : b
    ))
  } catch (error) {
    // Remove optimistic booking on error
    setBookings(prev => prev.filter(b => b.id !== optimisticBooking.id))
    throw error
  }
}
```

## 📊 Pagination

### Pagination Parameters
```typescript
// Request with pagination
const response = await api.get('/api/bookings', {
  params: {
    page: 1,
    per_page: 10
  }
})

// Response includes pagination metadata
const { items, total, page, per_page, total_pages } = response.data
```

### Pagination Hook
```typescript
export const usePagination = (endpoint: string) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await api.get(endpoint, {
        params: { page, per_page: pagination.per_page }
      })
      setData(response.data.items)
      setPagination({
        page: response.data.page,
        per_page: response.data.per_page,
        total: response.data.total,
        total_pages: response.data.total_pages
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { data, pagination, isLoading, fetchData }
}
```

## 🔒 Security Considerations

### Token Security
- **Never store tokens in plain text**
- **Use secure storage** (localStorage for SPA, httpOnly cookies for SSR)
- **Implement token rotation** for enhanced security
- **Set appropriate token expiration times**

### Request Security
- **Always validate input** on both client and server
- **Use HTTPS** in production
- **Implement rate limiting** to prevent abuse
- **Sanitize user input** to prevent XSS attacks

### CORS Configuration
Ensure your backend has proper CORS configuration:

```rust
// Rust backend CORS example
use actix_cors::Cors;

let cors = Cors::default()
    .allowed_origin("http://localhost:4000")
    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "PATCH"])
    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::CONTENT_TYPE])
    .supports_credentials();
```

## 🧪 Testing API Integration

### Mock API for Development
```typescript
// Mock API responses for development
const mockApi = {
  get: async (url: string) => {
    // Return mock data based on URL
    if (url.includes('/api/bookings')) {
      return { data: { items: mockBookings } }
    }
    // ... other endpoints
  }
}
```

### API Testing Checklist
- [ ] Authentication flow works correctly
- [ ] Token refresh handles expired tokens
- [ ] Error responses are handled gracefully
- [ ] Loading states are shown during requests
- [ ] Data is properly cached and updated
- [ ] Pagination works correctly
- [ ] Real-time updates function properly

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/) 