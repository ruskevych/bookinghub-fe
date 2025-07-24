# GraphQL Operations for Booking Application

This directory contains all GraphQL operations (queries, mutations, and subscriptions) required for the frontend booking application. The operations are organized by domain and include comprehensive fragments for consistent field selection.

## 📁 File Structure

```
graphql/
├── fragments.graphql          # Reusable GraphQL fragments
├── auth.graphql              # Authentication operations
├── booking.graphql           # Booking management operations
├── service.graphql           # Service and time slot operations
├── provider.graphql          # Provider search and management
├── business.graphql          # Business management operations
├── admin.graphql             # Admin dashboard operations
├── notification.graphql      # Notification management
├── payment.graphql           # Payment processing operations
├── schema.graphql            # Complete GraphQL schema
└── README.md                 # This documentation
```

## 🎯 Implementation Status

### ✅ Already Implemented (REST API)
- Basic authentication (login/register)
- User management
- Service CRUD operations
- Booking CRUD operations
- Basic business operations

### 🔄 Needs GraphQL Migration
- Provider search and management
- Advanced booking wizard flows
- Admin dashboard analytics
- Notification system
- Payment processing
- Business analytics and reporting

## 📋 Operations by Domain

### 🔐 Authentication (`auth.graphql`)
- **Queries**: `GetCurrentUser`, `GetUserPreferences`
- **Mutations**: `Login`, `Register`, `RefreshToken`, `Logout`, `UpdateUser`, `UpdateUserPreferences`

### 📅 Booking Management (`booking.graphql`)
- **Queries**: `GetBookings`, `GetBooking`, `GetAvailableTimeSlots`, `GetStaffMembers`, `GetAddOnServices`, `GetBookingConfirmation`
- **Mutations**: `CreateBooking`, `UpdateBooking`, `CancelBooking`, `ConfirmBooking`, `CompleteBooking`, `UpdateBookingStatus`

### 🛠️ Service Management (`service.graphql`)
- **Queries**: `GetServices`, `GetService`, `GetServiceTimeSlots`, `GetServiceCategories`, `GetTimeSlots`, `GetStaffMembers`
- **Mutations**: `CreateService`, `UpdateService`, `DeleteService`, `CreateTimeSlot`, `UpdateTimeSlot`, `DeleteTimeSlot`

### 🔍 Provider Management (`provider.graphql`)
- **Queries**: `SearchProviders`, `GetProvider`, `GetProviderReviews`, `GetProviderAvailability`, `GetProviderStats`
- **Mutations**: `CreateProvider`, `UpdateProvider`, `DeleteProvider`, `ToggleFavoriteProvider`, `SubmitReview`, `RequestVerification`

### 🏢 Business Management (`business.graphql`)
- **Queries**: `GetBusinesses`, `GetBusiness`, `GetMyBusiness`, `GetBusinessSettings`, `GetBusinessAnalytics`, `GetBusinessReports`
- **Mutations**: `CreateBusiness`, `UpdateBusiness`, `DeleteBusiness`, `UpdateBusinessSettings`

### 👨‍💼 Admin Operations (`admin.graphql`)
- **Queries**: `GetAdminDashboard`, `GetAdminBookings`, `GetAdminUsers`, `GetAdminBusinesses`, `GetAdminProviders`, `GetAdminAnalytics`, `GetSystemHealth`
- **Mutations**: `AdminUpdateUser`, `AdminDeleteUser`, `AdminSuspendUser`, `AdminVerifyProvider`, `SendNotification`

### 🔔 Notifications (`notification.graphql`)
- **Queries**: `GetNotifications`, `GetUnreadNotificationCount`, `GetNotificationPreferences`, `GetBusinessNotificationSettings`
- **Mutations**: `MarkNotificationAsRead`, `UpdateNotificationPreferences`, `SendNotification`, `SendBulkNotification`

### 💳 Payment Processing (`payment.graphql`)
- **Queries**: `GetPaymentMethods`, `GetTransactions`, `GetTransaction`, `GetBusinessPaymentSettings`, `GetPayouts`, `GetPayoutSummary`
- **Mutations**: `AddPaymentMethod`, `ProcessPayment`, `ProcessBookingPayment`, `RefundPayment`, `RequestPayout`

## 🧩 Fragments

The `fragments.graphql` file contains reusable fragments for consistent field selection:

- `UserFields` - User information
- `BusinessFields` - Business information
- `ServiceFields` - Service details
- `BookingFields` - Booking information
- `ProviderFields` - Provider details
- `ReviewFields` - Review data
- `PaymentMethodFields` - Payment method details
- `NotificationFields` - Notification data

## 🔧 Usage Examples

### Basic Query with Fragments
```graphql
query GetUserBookings($userId: ID!) {
  bookings(userId: $userId) {
    items {
      ...BookingFields
      service {
        ...ServiceFields
      }
      user {
        ...UserFields
      }
    }
  }
}
```

### Mutation with Input Types
```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    ...BookingFields
    service {
      ...ServiceFields
    }
  }
}
```

### Conditional Fields
```graphql
query GetProvider($id: ID!, $includeReviews: Boolean = true) {
  provider(id: $id) {
    ...ProviderFields
    reviews @include(if: $includeReviews) {
      ...ReviewFields
    }
  }
}
```

## 🚀 Migration Strategy

### Phase 1: Core Operations
1. Set up GraphQL server with basic schema
2. Implement authentication operations
3. Migrate booking CRUD operations
4. Migrate service management

### Phase 2: Advanced Features
1. Implement provider search and management
2. Add notification system
3. Implement payment processing
4. Add business analytics

### Phase 3: Admin Features
1. Implement admin dashboard
2. Add system monitoring
3. Implement reporting features
4. Add bulk operations

## 🔒 Security Considerations

- All mutations require authentication
- Admin operations require admin role
- Business operations require business ownership
- Provider operations require provider role
- Input validation on all mutations
- Rate limiting on queries and mutations

## 📊 Performance Optimizations

- Use fragments for consistent field selection
- Implement field-level caching
- Use pagination for large datasets
- Implement query complexity analysis
- Use DataLoader for N+1 query prevention
- Implement query batching

## 🧪 Testing Strategy

- Unit tests for each operation
- Integration tests for complex workflows
- Performance tests for heavy queries
- Security tests for authorization
- End-to-end tests for critical paths

## 📝 Notes

- All timestamps are in ISO 8601 format
- IDs are UUIDs for security
- Pagination uses cursor-based pagination
- Error handling follows GraphQL error specification
- All operations include proper error types
- Input validation is handled at the schema level

## 🔗 Related Documentation

- [API Integration Guide](../docs/API-INTEGRATION.md)
- [Component Architecture](../docs/COMPONENT-ARCHITECTURE.md)
- [Deployment Guide](../docs/DEPLOYMENT-GUIDE.md) 