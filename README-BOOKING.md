# Booking App MVP

A modern booking application built with Next.js, React, TypeScript, and shadcn/ui components.

## Features

### 🎯 Core Features
- **Public Booking Page**: Users can browse services and book appointments
- **Authentication**: Login/Register with JWT tokens
- **User Dashboard**: View and manage personal bookings
- **Admin Dashboard**: Manage services, time slots, and all bookings

### 🔧 Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui with Radix UI and Tailwind CSS
- **API Client**: Axios with automatic token management
- **Authentication**: JWT with refresh token support
- **State Management**: React Context for authentication
- **Styling**: Tailwind CSS with responsive design

## Pages

### 1. Public Booking Page (`/`)
- Browse available services
- Select date and time slots
- Fill in booking information
- Redirects to login if not authenticated

### 2. Login Page (`/login`)
- Email/password authentication
- Form validation
- Redirects to dashboard on success

### 3. Register Page (`/register`)
- Create new account
- Name, email, password, phone (optional)
- Automatic login after registration

### 4. User Dashboard (`/dashboard`)
- View upcoming and past bookings
- Cancel bookings (if allowed)
- Quick access to book new appointments
- User profile display

### 5. Admin Dashboard (`/admin`)
- **Services Management**: Create, edit, delete services
- **Time Slots Management**: Create and manage available time slots
- **Bookings Overview**: View all system bookings
- Tabbed interface for easy navigation

## API Integration

The app integrates with a Rust backend API running on `localhost:3000`:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Service Endpoints
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Booking Endpoints
- `GET /api/bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/admin/bookings` - All bookings (admin)

### Time Slots Endpoints
- `GET /api/services/:id/time-slots` - Available slots for service
- `POST /api/time-slots` - Create time slot (admin)
- `DELETE /api/time-slots/:id` - Delete time slot (admin)

## Getting Started

1. **Start the backend server** (Rust API on `localhost:3000`)

2. **Install dependencies**:
   ```bash
   cd apps/v4
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:4000`

## User Flow

### For Customers:
1. Visit the homepage to browse services
2. Select a service and available time slot
3. Fill in booking details
4. Login/register if not authenticated
5. Confirm booking
6. View and manage bookings in the dashboard

### For Admins:
1. Login with admin credentials (users with `business_id`)
2. Access the admin dashboard
3. Manage services (create, edit, delete)
4. Create time slots for services
5. View all bookings and their status

## Key Components

### API Client (`/lib/api.ts`)
- Centralized API configuration
- Automatic JWT token injection
- Token refresh handling
- Typed API responses

### Authentication Context (`/contexts/auth-context.tsx`)
- Global authentication state
- Login/logout functionality
- Automatic token persistence
- User session management

### UI Components
- **ServiceSelect**: Service selection dropdown
- **TimeSlotGrid**: Calendar and time slot picker
- **BookingCard**: Display booking information
- **StatusBadge**: Booking status indicators

## Authentication Flow

1. User logs in → receives access & refresh tokens
2. Tokens stored in localStorage
3. API requests automatically include Authorization header
4. On 401 errors, automatic token refresh attempt
5. On refresh failure, redirect to login

## Admin Features

### Service Management
- Create services with name, description, duration, and price
- Edit existing services
- Delete services (with confirmation)
- View service details in cards

### Time Slot Management
- Create time slots for specific services
- Set start and end times
- Automatic availability tracking
- Delete time slots when needed

### Booking Management
- View all bookings across the system
- See booking status and user information
- Monitor booking activity

## Error Handling

- Form validation with real-time feedback
- API error handling with user-friendly messages
- Loading states for all async operations
- Toast notifications for success/error feedback

## Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface
- Consistent spacing and typography

## Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Input validation
- XSS protection

## Future Enhancements

- Real-time booking updates
- Email notifications
- Calendar integration
- Payment processing
- Multi-language support
- Advanced booking rules

---

This MVP provides a solid foundation for a booking system with room for future enhancements and scaling. 