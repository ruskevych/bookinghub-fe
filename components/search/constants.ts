// Helper function to get realistic dates
const getDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  category: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  distance: string;
  image: string;
  available: string;
  isFavorite: boolean;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  nextAvailableSlot: {
    date: string;
    time: string;
  };
  availabilityWindows: {
    today: boolean;
    tomorrow: boolean;
    thisWeek: boolean;
    nextWeek: boolean;
  };
  upcomingSlots: Array<{ date: string; time: string }>;
}

export interface SearchFormData extends Filters {
  searchQuery: string;
}

export const mockProviders = [
  {
    id: "1",
    name: "Sarah Johnson",
    businessName: "Elite Hair Studio",
    category: "Hair & Beauty",
    rating: 4.9,
    reviewCount: 156,
    startingPrice: 45,
    distance: "0.3 miles",
    image: "/avatars/01.png",
    available: "Available today",
    isFavorite: false,
    description: "Specializing in cuts, color, and styling",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "10:30"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: false // Busy next week
    },
    upcomingSlots: [
      { date: getDateString(0), time: "10:30" },
      { date: getDateString(0), time: "14:00" },
      { date: getDateString(1), time: "09:00" }
    ]
  },
  {
    id: "2", 
    name: "Dr. Michael Chen",
    businessName: "Downtown Medical Center",
    category: "Healthcare",
    rating: 4.8,
    reviewCount: 89,
    startingPrice: 120,
    distance: "0.7 miles",
    image: "/avatars/02.png",
    available: "Next available: Tomorrow 2PM",
    isFavorite: true,
    description: "General practice and preventive care",
    address: "456 Broadway Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    nextAvailableSlot: {
      date: getDateString(1), // Tomorrow
      time: "14:00"
    },
    availabilityWindows: {
      today: false, // Fully booked today
      tomorrow: true,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: [
      { date: getDateString(1), time: "14:00" },
      { date: getDateString(2), time: "10:00" },
      { date: getDateString(3), time: "16:30" }
    ]
  },
  {
    id: "3",
    name: "Alex Rodriguez",
    businessName: "FitLife Personal Training",
    category: "Fitness & Wellness", 
    rating: 4.7,
    reviewCount: 234,
    startingPrice: 75,
    distance: "1.2 miles",
    image: "/avatars/03.png",
    available: "Available today",
    isFavorite: false,
    description: "Personal training and nutrition coaching",
    address: "789 Fitness Blvd",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "16:00"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "4",
    name: "Jennifer Park",
    businessName: "Zen Massage Therapy",
    category: "Fitness & Wellness",
    rating: 4.9,
    reviewCount: 167,
    startingPrice: 85,
    distance: "0.5 miles", 
    image: "/avatars/04.png",
    available: "Available today",
    isFavorite: false,
    description: "Therapeutic and relaxation massage",
    address: "321 Wellness Way",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "11:00"
    },
    availabilityWindows: {
      today: true,
      tomorrow: false, // Busy tomorrow
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "5",
    name: "Robert Wilson",
    businessName: "Wilson Home Repairs",
    category: "Home Services",
    rating: 4.6,
    reviewCount: 198,
    startingPrice: 65,
    distance: "2.1 miles",
    image: "/avatars/05.png", 
    available: "Next available: This week",
    isFavorite: false,
    description: "Plumbing, electrical, and general repairs",
    address: "654 Service Lane",
    city: "Queens",
    state: "NY",
    zipCode: "11101",
    nextAvailableSlot: {
      date: getDateString(3), // 3 days from now
      time: "09:00"
    },
    availabilityWindows: {
      today: false, // Busy today and tomorrow
      tomorrow: false,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "6",
    name: "Lisa Thompson",
    businessName: "AutoCare Plus",
    category: "Automotive",
    rating: 4.5,
    reviewCount: 143,
    startingPrice: 89,
    distance: "1.8 miles",
    image: "/avatars/06.png",
    available: "Available tomorrow",
    isFavorite: true,
    description: "Oil changes, tune-ups, and repairs",
    address: "987 Auto Street",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11205",
    nextAvailableSlot: {
      date: getDateString(1), // Tomorrow
      time: "08:00"
    },
    availabilityWindows: {
      today: false, // Busy today
      tomorrow: true,
      thisWeek: true,
      nextWeek: false // Busy next week
    },
    upcomingSlots: []
  },
  {
    id: "7",
    name: "David Martinez",
    businessName: "Martinez Legal Services", 
    category: "Professional Services",
    rating: 4.8,
    reviewCount: 76,
    startingPrice: 150,
    distance: "0.9 miles",
    image: "/avatars/01.png",
    available: "Next available: Next week",
    isFavorite: false,
    description: "Business law and contracts",
    address: "147 Legal Plaza",
    city: "New York",
    state: "NY",
    zipCode: "10004",
    nextAvailableSlot: {
      date: getDateString(8), // Next week
      time: "13:00"
    },
    availabilityWindows: {
      today: false, // Fully booked until next week
      tomorrow: false,
      thisWeek: false,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "8",
    name: "Emily Davis",
    businessName: "Happy Paws Grooming",
    category: "Pet Care", 
    rating: 4.9,
    reviewCount: 289,
    startingPrice: 35,
    distance: "1.5 miles",
    image: "/avatars/02.png",
    available: "Available today",
    isFavorite: false,
    description: "Professional pet grooming and care",
    address: "258 Pet Paradise Dr",
    city: "Manhattan",
    state: "NY",
    zipCode: "10010",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "13:30"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "9",
    name: "James Wilson",
    businessName: "Wilson Tutoring Center",
    category: "Education",
    rating: 4.7,
    reviewCount: 112,
    startingPrice: 55,
    distance: "2.3 miles", 
    image: "/avatars/03.png",
    available: "Available this week",
    isFavorite: false,
    description: "Math, science, and test prep tutoring",
    address: "369 Education Ave",
    city: "Bronx",
    state: "NY",
    zipCode: "10451",
    nextAvailableSlot: {
      date: getDateString(4), // 4 days from now
      time: "15:00"
    },
    availabilityWindows: {
      today: false, // Busy today and tomorrow
      tomorrow: false,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: [],
  },
  {
    id: "10",
    name: "Maria Garcia",
    businessName: "Glow Aesthetics",
    category: "Hair & Beauty",
    rating: 4.8,
    reviewCount: 203,
    startingPrice: 65,
    distance: "0.8 miles",
    image: "/avatars/04.png",
    available: "Available today",
    isFavorite: true,
    description: "Facials, skincare, and beauty treatments",
    address: "741 Beauty Boulevard",
    city: "New York",
    state: "NY",
    zipCode: "10005",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "12:00"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: false // Busy next week
    },
    upcomingSlots: []
  },
  {
    id: "11",
    name: "Michael Johnson",
    businessName: "Tech Solutions Pro",
    category: "Professional Services",
    rating: 4.6,
    reviewCount: 95,
    startingPrice: 125,
    distance: "3.2 miles",
    image: "/avatars/05.png",
    available: "Available today",
    isFavorite: false,
    description: "IT consulting and computer repair services",
    address: "852 Tech Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "17:00"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  },
  {
    id: "12",
    name: "Amanda Rodriguez",
    businessName: "Flex Yoga Studio",
    category: "Fitness & Wellness",
    rating: 4.8,
    reviewCount: 178,
    startingPrice: 55,
    distance: "1.7 miles",
    image: "/avatars/06.png",
    available: "Available today",
    isFavorite: false,
    description: "Yoga classes and mindfulness training",
    address: "963 Wellness Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    nextAvailableSlot: {
      date: getDateString(0), // Today
      time: "18:00"
    },
    availabilityWindows: {
      today: true,
      tomorrow: false, // Busy tomorrow
      thisWeek: true,
      nextWeek: true
    },
    upcomingSlots: []
  }
];

export const categories = [
  "Hair & Beauty",
  "Healthcare", 
  "Fitness & Wellness",
  "Home Services",
  "Automotive",
  "Professional Services",
  "Pet Care",
  "Education"
];

export const recentSearches = ["Hair salon near me", "Personal trainer", "Dentist", "Plumber", "Car repair"];
export const popularServices = ["Haircut", "Massage", "House cleaning", "Tutoring", "Dog grooming"];

export const quickDateOptions = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Week", value: "week" },
  { label: "Next Week", value: "next-week" }
];

export const sortOptions = [
  { label: "Best Match", value: "best-match" },
  { label: "Earliest Available", value: "availability" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Distance", value: "distance" },
  { label: "Newest", value: "newest" }
];

export type ViewMode = "grid" | "list" | "map";

export interface Filters {
  categories: string[];
  location: string;
  priceRange: number[];
  availability: string[];
  sortBy: string;
} 