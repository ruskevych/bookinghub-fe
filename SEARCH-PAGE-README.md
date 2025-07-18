# BookingHub Service Search/Browse Page

A comprehensive, modern service search and browse interface built with Next.js, React, TypeScript, and shadcn/ui components.

## 🌟 Features

### Core Functionality
- **Advanced Search**: Real-time search with debouncing for optimal performance
- **Smart Filtering**: Multi-faceted filtering system with categories, location, price, and availability
- **Multiple View Modes**: Grid, List, and Map view options
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Aesthetics**: Similar to Airbnb or OpenTable search pages

### User Interface Components

#### 1. Header Section
- **BookingHub Logo**: Prominent branding on the left
- **Search Bar**: 
  - Placeholder: "Search services or providers..."
  - Auto-complete dropdown with recent searches and popular services
  - Voice search option (UI ready)
  - Keyboard navigation support
- **User Profile/Login**: Authentication buttons on the right

#### 2. Filters Sidebar (Desktop) / Collapsible (Mobile)
- **Category Filter**: 
  - 8 main categories: Hair & Beauty, Healthcare, Fitness & Wellness, Home Services, Automotive, Professional Services, Pet Care, Education
  - "Show more" expandable option
- **Location Filter**:
  - "Near Me" button with geolocation support
  - City/ZIP code input field
  - Radius slider (1-50 miles)
- **Price Range Filter**:
  - Dual-handle slider ($0-$500+)
  - Quick selection buttons for popular price ranges
- **Availability Filter**:
  - Quick buttons: Today, Tomorrow, This Week, Next Week
  - Custom date picker
  - Time of day preferences (Morning, Afternoon, Evening)
- **Sort Options**: Best Match, Price (Low/High), Rating, Distance, Newest

#### 3. Main Content Area
- **Results Header**: Shows count and location context
- **View Toggle**: Switch between Grid, List, and Map views
- **Active Filters Display**: Visual badges with one-click removal
- **Provider Cards**: Responsive grid layout (3/2/1 columns for desktop/tablet/mobile)

#### 4. Provider Cards
Each card features:
- **Provider Information**: Photo, name, business name
- **Category Badge**: Service category indicator
- **Rating System**: 5-star display with review count
- **Pricing**: "From $X" starting price
- **Location**: Distance indicator
- **Availability**: Real-time availability status
- **Favorites**: Heart icon for bookmarking
- **Call-to-Action**: "Book Now" button
- **Hover Effects**: Subtle shadow and scale animations

#### 5. Interactive Features
- **Search Autocomplete**: Recent searches and popular services
- **Filter Animations**: Smooth slide-in/out effects
- **View Mode Transitions**: Seamless switching between layouts
- **Loading States**: Professional skeleton screens
- **Empty States**: Helpful suggestions when no results found
- **Recently Viewed**: Horizontal scroll section
- **Save Search**: Option to save search criteria with notifications

## 🎨 Design Features

### Responsive Behavior
- **Mobile**: Collapsible filter drawer, single column cards, touch-optimized
- **Tablet**: Two-column grid, condensed filters
- **Desktop**: Full sidebar, three-column grid, hover interactions

### Animations & Transitions
- **Card Hover Effects**: Lift and scale animation
- **Filter Badges**: Smooth entry animations
- **Favorite Hearts**: Bounce animation when toggled
- **Staggered Loading**: Cards appear with progressive delays
- **View Mode Switching**: Smooth layout transitions

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus States**: Clear focus indicators
- **Color Contrast**: WCAG compliant color schemes

## 🛠 Technical Implementation

### File Structure
```
apps/v4/
├── app/(app)/search/page.tsx          # Main search page component
├── hooks/
│   ├── use-search.ts                  # Search state management hook
│   └── use-debounce.ts               # Debouncing utility hook
├── lib/
│   └── location.ts                   # Geolocation utilities
└── styles/globals.css                # Custom animations
```

### Custom Hooks

#### `useSearch`
Manages all search-related state:
- Search query with debouncing
- Filter states and updates
- View mode switching
- Favorites management
- Search statistics

#### `useDebounce`
Optimizes search performance by debouncing user input with configurable delay.

### Key Features Implementation

#### Real-time Search
```typescript
const debouncedQuery = useDebounce(searchQuery, 300)
// Automatically filters providers based on debounced input
```

#### Advanced Filtering
- **Multi-select Categories**: Checkbox-based selection
- **Price Range**: Dual-handle slider with quick buttons
- **Location Radius**: Slider with "Near Me" geolocation
- **Availability**: Date picker and time preferences

#### Responsive Design
```css
/* Grid responsiveness */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Mobile-first approach */
.lg:block     // Show on desktop
.md:hidden    // Hide on mobile
```

## 🗃 Mock Data Structure

### Service Provider Schema
```typescript
interface ServiceProvider {
  id: string
  name: string
  businessName: string
  category: string
  rating: number
  reviewCount: number
  startingPrice: number
  distance: string
  image: string
  available: string
  isFavorite: boolean
  description: string
}
```

### Sample Data
- **20+ diverse service providers** across all categories
- **Varied ratings** (4.5-4.9) with realistic review counts
- **Different price ranges** ($35-$150) for comprehensive filtering
- **Mixed availability patterns** (today, tomorrow, this week, next week)
- **Professional descriptions** for each service provider

## 🎯 User Experience

### Search Flow
1. **Landing**: User sees clean interface with search bar prominence
2. **Input**: Auto-complete suggestions appear as user types
3. **Filtering**: Sidebar filters provide granular control
4. **Results**: Cards display with smooth animations
5. **Interaction**: Hover effects and smooth transitions
6. **Selection**: One-click booking with clear call-to-action

### Performance Optimizations
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Memoized Results**: React.useMemo for efficient re-renders
- **Lazy Loading**: Cards load progressively
- **Smooth Animations**: CSS transitions with hardware acceleration

### Error Handling
- **No Results**: Helpful empty state with filter suggestions
- **Location Errors**: Graceful geolocation failure handling
- **Loading States**: Professional skeleton screens during data fetch

## 🚀 Getting Started

### Prerequisites
- Next.js 13+ with App Router
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Running the Search Page

1. **Navigate to Search**: 
   - Click "Browse Services" in the main navigation
   - Or visit `/search` directly

2. **Use Search Features**:
   - Type in the search bar to see auto-complete
   - Apply filters from the sidebar
   - Switch between view modes
   - Click heart icons to favorite providers
   - Use "Book Now" buttons for provider selection

## 🔮 Future Enhancements

### Planned Features
- **Map Integration**: Real Google Maps with provider pins
- **Advanced Search**: Filters by ratings, languages, certifications
- **Real-time Chat**: Direct messaging with providers
- **Reviews System**: User reviews and ratings
- **Booking Calendar**: Integrated scheduling system
- **Push Notifications**: Search alerts and booking reminders

### Technical Improvements
- **API Integration**: Connect to real backend services
- **Caching**: Redis for search result caching
- **Analytics**: User behavior tracking
- **SEO Optimization**: Server-side rendering for search pages
- **PWA Features**: Offline search capabilities

## 📱 Mobile Experience

### Touch Optimizations
- **Large Touch Targets**: 44px minimum for buttons
- **Swipe Gestures**: Horizontal scroll for recently viewed
- **Pull-to-Refresh**: Search results refresh
- **Bottom Sheet**: Filter panel slides up from bottom

### Performance
- **Fast Loading**: Optimized images and lazy loading
- **Smooth Scrolling**: Hardware-accelerated transitions
- **Offline Support**: Basic caching for recently viewed

## 🎨 Customization

### Theming
The search page fully supports the BookingHub theme system with:
- **CSS Variables**: Easy color customization
- **Dark Mode**: Automatic theme switching
- **Brand Colors**: Consistent with overall design system

### Component Variations
All components use shadcn/ui variants for easy customization:
```typescript
// Button variants
variant="default" | "outline" | "ghost" | "secondary"

// Card styles  
className="hover:shadow-lg transition-all duration-300"
```

## 🧪 Testing

### Interactive Elements to Test
- [ ] Search autocomplete and selection
- [ ] Filter combinations and clearing
- [ ] View mode switching
- [ ] Favorite toggling with animation
- [ ] Mobile responsiveness
- [ ] Loading and empty states
- [ ] Smooth animations and transitions

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

Built with ❤️ using Next.js, shadcn/ui, and modern web technologies. 