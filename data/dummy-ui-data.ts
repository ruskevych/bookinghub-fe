// UI-related dummy data that can be easily replaced with backend data later

// Service categories for filtering
export const SERVICE_CATEGORIES = [
  'All',
  'Hair & Beauty',
  'Automotive',
  'Home Services',
  'Health & Wellness',
  'Pet Services',
  'Events & Entertainment',
  'Business Services',
  'Education & Training',
  'Technology'
];

// Gallery image categories for filtering
export const GALLERY_CATEGORIES = [
  'All',
  'portfolio',
  'before_after',
  'workspace',
  'certificates'
];

// Review filter options
export const REVIEW_FILTER_OPTIONS = [
  { value: null, label: 'All Reviews' },
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' }
];

// Review sort options
export const REVIEW_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' }
];

// Verification badge labels
export const VERIFICATION_BADGES = {
  isVerified: 'Verified Provider',
  backgroundCheck: 'Background Checked',
  phoneVerified: 'Phone Verified',
  emailVerified: 'Email Verified',
  licenseVerified: 'License Verified'
};

// Achievement badges that providers can have
export const ACHIEVEMENT_BADGES = [
  'Top Rated',
  'Quick Response',
  'Professional',
  'ASE Certified',
  'Reliable',
  'Fair Pricing',
  'New Provider',
  'Eco Friendly',
  'Same Day Service',
  'Emergency Available'
];

// Day names for business hours
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

// Display names for days
export const DAY_DISPLAY_NAMES = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday', 
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

// Calendar view options
export const CALENDAR_VIEW_OPTIONS = [
  { value: 'week', label: 'Week View' },
  { value: 'month', label: 'Month View' }
];

// Time slot statuses with display info
export const SLOT_STATUS_CONFIG = {
  available: {
    label: 'Available',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
    clickable: true
  },
  busy: {
    label: 'Busy',
    className: 'bg-red-100 text-red-800 cursor-not-allowed',
    clickable: false
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-gray-100 text-gray-600 cursor-not-allowed',
    clickable: false
  }
};

// Languages commonly offered by service providers
export const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Mandarin'
];

// Service provider view mode options
export const VIEW_MODE_OPTIONS = [
  { value: 'grid', label: 'Grid View', icon: 'Grid3X3' },
  { value: 'list', label: 'List View', icon: 'List' }
];

// Tab navigation for provider profile
export const PROVIDER_PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'About' }
];

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  return category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Helper function to format time slots
export function formatTimeSlot(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// Helper function to get initials from name
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
} 