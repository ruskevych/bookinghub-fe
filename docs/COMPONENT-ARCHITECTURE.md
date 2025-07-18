# Component Architecture Guide

This document outlines the component architecture, patterns, and best practices used in BookingHub.

## 🏗 Component Structure

### Directory Organization

```
components/
├── auth/                    # Authentication components
│   ├── auth-nav.tsx        # Navigation for authenticated users
│   └── index.ts            # Auth component exports
├── booking/                # Booking flow components
│   ├── booking-form.tsx    # Main booking form
│   ├── booking-wizard.tsx  # Multi-step booking wizard
│   ├── book-now-button.tsx # Call-to-action button
│   ├── steps/              # Individual wizard steps
│   │   ├── service-select.tsx
│   │   ├── time-slot-picker.tsx
│   │   └── customer-info.tsx
│   └── index.ts            # Booking component exports
├── booking-confirmation/   # Confirmation page components
│   ├── BookingDetails.tsx  # Appointment details display
│   ├── ProviderInfo.tsx    # Provider information
│   ├── LocationMap.tsx     # Location and directions
│   ├── CalendarIntegration.tsx # Calendar export
│   ├── BookingActions.tsx  # Management actions
│   └── index.ts            # Confirmation component exports
├── cards/                  # Card-based UI components
│   ├── activity-goal.tsx   # Activity tracking cards
│   ├── calendar.tsx        # Calendar display cards
│   ├── chat.tsx           # Chat interface cards
│   └── index.ts           # Card component exports
├── providers/             # Provider-related components
│   ├── ProviderAbout.tsx  # Provider information
│   ├── ProviderCalendar.tsx # Provider availability
│   └── index.ts           # Provider component exports
├── search/                # Search interface components
│   ├── filter-sidebar.tsx # Search filters
│   ├── provider-card.tsx  # Provider display cards
│   ├── constants.ts       # Search constants
│   └── index.ts           # Search component exports
└── ui/                    # Base UI components (shadcn/ui)
    ├── button.tsx         # Button component
    ├── card.tsx          # Card component
    ├── input.tsx         # Input component
    └── index.ts          # UI component exports
```

## 🎯 Component Patterns

### 1. Compound Components

Complex UI patterns use compound component patterns for flexibility:

```typescript
// BookingWizard compound component
interface BookingWizardProps {
  children: React.ReactNode
  onComplete: (booking: Booking) => void
}

interface BookingWizardContextType {
  currentStep: number
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  bookingData: Partial<Booking>
  updateBookingData: (data: Partial<Booking>) => void
}

const BookingWizardContext = createContext<BookingWizardContextType | undefined>(undefined)

export const BookingWizard: React.FC<BookingWizardProps> & {
  Step: typeof BookingWizardStep
  Navigation: typeof BookingWizardNavigation
} = ({ children, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingData, setBookingData] = useState<Partial<Booking>>({})

  const value: BookingWizardContextType = {
    currentStep,
    goToStep: setCurrentStep,
    nextStep: () => setCurrentStep(prev => prev + 1),
    prevStep: () => setCurrentStep(prev => prev - 1),
    bookingData,
    updateBookingData: (data) => setBookingData(prev => ({ ...prev, ...data }))
  }

  return (
    <BookingWizardContext.Provider value={value}>
      <div className="booking-wizard">
        {children}
      </div>
    </BookingWizardContext.Provider>
  )
}

// Usage
<BookingWizard onComplete={handleBookingComplete}>
  <BookingWizard.Step step={0}>
    <ServiceSelect />
  </BookingWizard.Step>
  <BookingWizard.Step step={1}>
    <TimeSlotPicker />
  </BookingWizard.Step>
  <BookingWizard.Navigation />
</BookingWizard>
```

### 2. Render Props Pattern

For flexible component composition:

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  renderRow?: (item: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  renderRow,
  renderEmpty,
  renderLoading
}: DataTableProps<T>) => {
  if (renderLoading && !data) {
    return renderLoading()
  }

  if (renderEmpty && data.length === 0) {
    return renderEmpty()
  }

  return (
    <div className="data-table">
      {data.map((item, index) => 
        renderRow ? renderRow(item, index) : <DefaultRow key={index} item={item} columns={columns} />
      )}
    </div>
  )
}

// Usage
<DataTable
  data={bookings}
  columns={bookingColumns}
  renderRow={(booking) => <BookingRow booking={booking} />}
  renderEmpty={() => <EmptyState message="No bookings found" />}
  renderLoading={() => <LoadingSpinner />}
/>
```

### 3. Custom Hooks Pattern

Business logic is extracted into custom hooks:

```typescript
// useBooking hook
export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/api/bookings')
      setBookings(response.data.items)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (bookingData: CreateBookingRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.post('/api/bookings', bookingData)
      setBookings(prev => [...prev, response.data])
      return response.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await api.patch(`/api/bookings/${bookingId}/cancel`)
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled' as const }
          : booking
      ))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking
  }
}
```

## 🎨 Styling Patterns

### 1. Tailwind CSS with Custom Utilities

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Component usage
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Variant styles
          variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700",
          variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          
          // Size styles
          size === 'sm' && "h-8 px-3 text-sm",
          size === 'md' && "h-10 px-4 py-2",
          size === 'lg' && "h-12 px-8 text-lg",
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 2. CSS Variables for Theming

```css
/* styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

### 3. Responsive Design Patterns

```typescript
// Mobile-first responsive design
const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {children}
  </div>
)

// Responsive text sizing
const ResponsiveText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm sm:text-base lg:text-lg">
    {children}
  </p>
)

// Responsive spacing
const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 sm:p-6 lg:p-8">
    {children}
  </div>
)
```

## 🔄 State Management Patterns

### 1. Context for Global State

```typescript
// contexts/auth-context.tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      setUser(response.data.user)
      setTokens(response.data.access_token, response.data.refresh_token)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    clearTokens()
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 2. Local State with useState

```typescript
// Component with local state
export const BookingForm = () => {
  const [formData, setFormData] = useState({
    serviceId: '',
    timeSlotId: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await createBooking(formData)
      // Handle success
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 3. Derived State with useMemo

```typescript
// Derived state example
export const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  const upcomingBookings = useMemo(() => 
    bookings.filter(booking => 
      new Date(booking.start_time) > new Date() && 
      booking.status === 'Confirmed'
    ),
    [bookings]
  )

  const pastBookings = useMemo(() => 
    bookings.filter(booking => 
      new Date(booking.start_time) < new Date()
    ),
    [bookings]
  )

  const cancelledBookings = useMemo(() => 
    bookings.filter(booking => booking.status === 'Cancelled'),
    [bookings]
  )

  return (
    <div>
      <BookingSection title="Upcoming" bookings={upcomingBookings} />
      <BookingSection title="Past" bookings={pastBookings} />
      <BookingSection title="Cancelled" bookings={cancelledBookings} />
    </div>
  )
}
```

## 🎯 Performance Optimization

### 1. React.memo for Expensive Components

```typescript
// Memoized component
export const ProviderCard = React.memo<ProviderCardProps>(({ provider, onBook }) => {
  return (
    <Card className="provider-card">
      <CardHeader>
        <CardTitle>{provider.name}</CardTitle>
        <CardDescription>{provider.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="provider-rating">
          <StarRating rating={provider.rating} />
          <span>({provider.reviewCount} reviews)</span>
        </div>
        <div className="provider-price">
          From ${provider.startingPrice}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onBook(provider)}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
})

ProviderCard.displayName = 'ProviderCard'
```

### 2. useCallback for Event Handlers

```typescript
// Optimized event handlers
export const BookingWizard = ({ onComplete }: { onComplete: (booking: Booking) => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingData, setBookingData] = useState<Partial<Booking>>({})

  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev + 1)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentStep(prev => prev - 1)
  }, [])

  const handleComplete = useCallback((finalData: Booking) => {
    onComplete(finalData)
  }, [onComplete])

  const updateBookingData = useCallback((data: Partial<Booking>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }, [])

  return (
    <div className="booking-wizard">
      {/* Wizard content */}
    </div>
  )
}
```

### 3. Lazy Loading for Large Components

```typescript
// Lazy loaded components
const BookingConfirmation = lazy(() => import('./BookingConfirmation'))
const AdminDashboard = lazy(() => import('./AdminDashboard'))

// Usage with Suspense
export const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  )
}
```

## 🔧 Component Testing Patterns

### 1. Component Testing with Testing Library

```typescript
// Component test example
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingForm } from './BookingForm'

describe('BookingForm', () => {
  it('submits booking data correctly', async () => {
    const mockOnSubmit = jest.fn()
    render(<BookingForm onSubmit={mockOnSubmit} />)

    // Fill form
    fireEvent.change(screen.getByLabelText('Service'), {
      target: { value: 'service-123' }
    })
    fireEvent.change(screen.getByLabelText('Time Slot'), {
      target: { value: 'slot-123' }
    })
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Test booking' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        serviceId: 'service-123',
        timeSlotId: 'slot-123',
        notes: 'Test booking'
      })
    })
  })
})
```

### 2. Custom Hook Testing

```typescript
// Hook test example
import { renderHook, act } from '@testing-library/react'
import { useBooking } from './useBooking'

describe('useBooking', () => {
  it('fetches bookings successfully', async () => {
    const { result } = renderHook(() => useBooking())

    act(() => {
      result.current.fetchBookings()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.bookings).toHaveLength(2)
    })
  })
})
```

## 📱 Accessibility Patterns

### 1. ARIA Labels and Roles

```typescript
// Accessible component
export const BookingWizard = () => {
  return (
    <div role="main" aria-label="Booking Wizard">
      <nav role="navigation" aria-label="Booking Steps">
        <ol>
          <li aria-current="step">Select Service</li>
          <li>Choose Time</li>
          <li>Confirm Booking</li>
        </ol>
      </nav>
      
      <section aria-labelledby="step-title">
        <h2 id="step-title">Select a Service</h2>
        {/* Step content */}
      </section>
    </div>
  )
}
```

### 2. Keyboard Navigation

```typescript
// Keyboard accessible component
export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(service)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onSelect(service)}
      className="service-card"
    >
      <h3>{service.name}</h3>
      <p>{service.description}</p>
    </div>
  )
}
```

### 3. Focus Management

```typescript
// Focus management hook
export const useFocusTrap = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  }, [ref])
}
```

## 🎨 Design System Integration

### 1. shadcn/ui Component Usage

```typescript
// Consistent component usage
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"

export const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card className="service-card">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{service.description}</p>
        <div className="service-price">
          ${service.price}
        </div>
        <Button variant="default" size="lg">
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 2. Consistent Spacing and Typography

```typescript
// Spacing utilities
const spacing = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8'
}

// Typography scale
const typography = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-medium',
  body: 'text-base leading-relaxed',
  small: 'text-sm text-muted-foreground'
}
```

This component architecture provides a solid foundation for building scalable, maintainable, and performant React applications while maintaining consistency and accessibility standards. 