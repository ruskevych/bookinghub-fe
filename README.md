# BookingHub - Modern Booking Application

A comprehensive, modern booking application built with Next.js 15, React 19, TypeScript, and shadcn/ui components. This application provides a complete solution for service booking, user management, and business administration.

## 📋 Overview

BookingHub is a full-featured booking platform that enables users to discover, book, and manage appointments with service providers. The application includes both customer-facing features and comprehensive admin tools for business management.

### 🎯 Core Features

- **Public Booking Interface**: Browse services and book appointments
- **User Authentication**: Secure login/register with JWT tokens
- **Service Search & Discovery**: Advanced search with filters and multiple view modes
- **Booking Management**: Create, view, and cancel appointments
- **Admin Dashboard**: Complete business management tools
- **Booking Confirmation**: Comprehensive confirmation pages with calendar integration
- **Provider Profiles**: Detailed provider information and ratings
- **Mobile-Responsive Design**: Optimized for all device sizes

### 🏗 Architecture

- **Frontend**: Next.js 15 with App Router
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theming
- **State Management**: React Context + Custom Hooks
- **API Integration**: Axios with automatic token management
- **Authentication**: JWT with refresh token support
- **Type Safety**: Full TypeScript implementation

## 📁 Folder Structure

```
apps/v4/
├── app/                          # Next.js App Router pages
│   ├── (app)/                   # Main application routes
│   │   ├── admin/              # Admin dashboard and management
│   │   ├── booking/            # Booking flow pages
│   │   ├── booking-confirmation/ # Booking confirmation pages
│   │   ├── dashboard/          # User dashboard
│   │   ├── login/              # Authentication pages
│   │   ├── register/           # User registration
│   │   ├── search/             # Service search and discovery
│   │   ├── providers/          # Provider profile pages
│   │   └── test-confirmation/  # Testing utilities
│   ├── (internal)/             # Internal utility pages
│   ├── (view)/                 # View-only pages
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                  # Reusable React components
│   ├── auth/                   # Authentication components
│   ├── booking/                # Booking flow components
│   ├── booking-confirmation/   # Confirmation page components
│   ├── cards/                  # Card-based UI components
│   ├── providers/              # Provider-related components
│   ├── search/                 # Search interface components
│   └── ui/                     # Base UI components (shadcn/ui)
├── contexts/                   # React Context providers
│   └── auth-context.tsx        # Authentication state management
├── data/                       # Mock data and static content
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries and configurations
├── public/                     # Static assets
├── registry/                   # shadcn/ui component registry
├── styles/                     # Global styles and themes
├── types/                      # TypeScript type definitions
└── scripts/                    # Build and utility scripts
```

## 🔧 Key Components

### Authentication System
- **AuthContext** (`contexts/auth-context.tsx`): Global authentication state management
- **AuthProvider**: JWT token handling with automatic refresh
- **Protected Routes**: Route-level authentication guards

### Booking Flow
- **BookingWizard** (`components/booking/booking-wizard.tsx`): Multi-step booking process
- **ServiceSelect**: Service selection with filtering
- **TimeSlotGrid**: Calendar and time slot picker
- **BookingForm**: Customer information collection

### Search & Discovery
- **SearchPage** (`app/(app)/search/page.tsx`): Advanced service search interface
- **FilterSidebar**: Multi-faceted filtering system
- **ProviderCard**: Service provider display cards
- **useSearch** (`hooks/use-search.ts`): Search state management

### Booking Confirmation
- **BookingDetails** (`components/booking-confirmation/BookingDetails.tsx`): Appointment information display
- **ProviderInfo**: Provider contact and details
- **LocationMap**: Location and directions integration
- **CalendarIntegration**: Calendar export functionality
- **BookingActions**: Reschedule and cancel options

### Admin Dashboard
- **Service Management**: Create, edit, and delete services
- **Time Slot Management**: Manage available appointment slots
- **Booking Overview**: View and manage all system bookings
- **User Management**: Customer and provider administration

## 🚀 Environment Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Backend API server (Rust API on localhost:3000)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:4000`

### Environment Variables

Create a `.env.local` file in the `apps/v4` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:4000

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Backend Requirements

The application expects a Rust backend API running on `localhost:3000` with the following endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/refresh` - Token refresh

#### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

#### Bookings
- `GET /api/bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/admin/bookings` - All bookings (admin)

#### Time Slots
- `GET /api/services/:id/time-slots` - Available slots for service
- `POST /api/time-slots` - Create time slot (admin)
- `DELETE /api/time-slots/:id` - Delete time slot (admin)

## 🎨 Development Conventions

### File Organization

#### Component Structure
- **Feature-based grouping**: Components are organized by feature (booking, search, auth)
- **Co-location**: Related components, hooks, and types are kept together
- **Index exports**: Each feature folder has an `index.ts` for clean imports

#### Naming Conventions
- **Components**: PascalCase (e.g., `BookingWizard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useBooking.ts`)
- **Types**: PascalCase (e.g., `BookingStatus`)
- **Files**: kebab-case for pages, PascalCase for components
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### UI Patterns

#### shadcn/ui Usage
The application uses shadcn/ui components with the "new-york" style variant:

```typescript
// Import from the registry
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card } from "@/registry/new-york-v4/ui/card"

// Use with variants
<Button variant="default" size="lg">
  Book Now
</Button>
```

#### Component Composition
- **Compound components**: Complex UI patterns use compound component patterns
- **Render props**: Flexible components use render prop patterns
- **Custom hooks**: Business logic is extracted into custom hooks

#### Styling Patterns
```typescript
// Tailwind CSS with custom utilities
import { cn } from "@/lib/utils"

const className = cn(
  "base-styles",
  variant === "primary" && "primary-styles",
  size === "lg" && "large-styles"
)
```

### State Management

#### Context Usage
- **AuthContext**: Global authentication state
- **Local state**: Component-specific state with `useState`
- **Custom hooks**: Complex state logic in custom hooks

#### Data Fetching
```typescript
// API calls with automatic error handling
const { data, isLoading, error } = useQuery({
  queryKey: ['bookings'],
  queryFn: () => bookingService.getBookings()
})
```

### TypeScript Patterns

#### Type Definitions
```typescript
// Strict typing for all API responses
interface Booking {
  id: string
  service_id: string
  user_id: string
  status: 'Pending' | 'Confirmed' | 'Cancelled'
  start_time: string
  end_time: string
}
```

#### Generic Components
```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

### Environment Variables for Production

```env
# Production API URL
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Authentication
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Build Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format:write
pnpm format:check
```

### Performance Optimization

- **Image optimization**: Next.js Image component with proper sizing
- **Code splitting**: Automatic route-based code splitting
- **Bundle analysis**: Use `@next/bundle-analyzer` for optimization
- **Caching**: Implement proper caching headers for static assets

## ❓ FAQ & Known Issues

### Common Issues

#### 1. **Authentication Token Expiry**
**Issue**: Users get logged out unexpectedly
**Solution**: The app automatically handles token refresh. If issues persist, check the backend refresh endpoint.

#### 2. **API Connection Errors**
**Issue**: "Failed to fetch" errors in development
**Solution**: Ensure the Rust backend is running on `localhost:3000` and CORS is properly configured.

#### 3. **Mobile Responsiveness Issues**
**Issue**: Layout breaks on mobile devices
**Solution**: All components are mobile-first. Test with browser dev tools and ensure proper viewport meta tags.

#### 4. **Build Errors with shadcn/ui**
**Issue**: Component import errors during build
**Solution**: Run `pnpm registry:build` to rebuild the component registry.

### Development Tips

#### 1. **Hot Reload Issues**
- Clear `.next` cache: `rm -rf .next`
- Restart dev server: `pnpm dev`

#### 2. **TypeScript Errors**
- Run type checking: `pnpm typecheck`
- Check for missing type definitions
- Ensure all API responses are properly typed

#### 3. **Styling Issues**
- Check Tailwind CSS configuration
- Verify CSS variables are properly set
- Use browser dev tools to inspect computed styles

#### 4. **Performance Issues**
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Implement proper memoization with `useMemo` and `useCallback`

### Browser Compatibility

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript features**: ES2020+ features are used throughout

### Testing

#### Manual Testing Checklist
- [ ] Authentication flow (login/register/logout)
- [ ] Booking flow (service selection → time slot → confirmation)
- [ ] Search functionality with filters
- [ ] Admin dashboard features
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Error handling and loading states

#### Automated Testing
```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time updates**: WebSocket integration for live booking updates
- **Payment processing**: Stripe integration for online payments
- **Email notifications**: Automated email confirmations and reminders
- **Calendar integration**: Google Calendar, Outlook sync
- **Multi-language support**: Internationalization (i18n)
- **Advanced analytics**: User behavior tracking and insights

### Technical Improvements
- **Performance optimization**: Server-side rendering for SEO
- **Caching strategy**: Redis for API response caching
- **Progressive Web App**: Offline capabilities and app-like experience
- **Microservices**: Backend service decomposition
- **Monitoring**: Application performance monitoring (APM)

## 📞 Support

For questions, issues, or contributions:

1. **Check existing documentation** in the `/docs` folder
2. **Review implementation summaries** in the root directory
3. **Create an issue** with detailed reproduction steps
4. **Submit a pull request** with clear description of changes

---

**BookingHub** - Making service booking simple and efficient.
