import { 
  Search, 
  CalendarIcon, 
  CheckCircle,
  Scissors,
  Stethoscope,
  Dumbbell,
  Home,
  Car,
  Briefcase,
  Zap,
  Shield,
  CreditCard,
  Headphones
} from 'lucide-react';

export const serviceCategories = [
  {
    icon: Scissors,
    title: "Hair & Beauty",
    description: "Haircuts, styling, spa treatments, and beauty services",
    services: "120+ services"
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    description: "Medical consultations, therapy, and wellness appointments",
    services: "80+ services"
  },
  {
    icon: Dumbbell,
    title: "Fitness",
    description: "Personal training, yoga classes, and fitness coaching",
    services: "45+ services"
  },
  {
    icon: Home,
    title: "Home Services",
    description: "Cleaning, repairs, maintenance, and home improvement",
    services: "200+ services"
  },
  {
    icon: Car,
    title: "Automotive",
    description: "Car servicing, repairs, detailing, and maintenance",
    services: "60+ services"
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    description: "Legal, financial, consulting, and business services",
    services: "90+ services"
  }
];

export const howItWorksSteps = [
  {
    icon: Search,
    title: "Choose Your Service",
    description: "Browse and select from hundreds of local services in your area"
  },
  {
    icon: CalendarIcon,
    title: "Pick Date & Time",
    description: "Select your preferred date and time from available slots"
  },
  {
    icon: CheckCircle,
    title: "Get Confirmation",
    description: "Receive instant confirmation and reminders for your appointment"
  }
];

export const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "1,000+", label: "Service Providers" },
  { value: "98%", label: "Satisfaction Rate" }
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    image: "/avatars/01.png",
    rating: 5,
    comment: "BookingHub made it so easy to find and book a great hairstylist. The whole process was seamless!"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    image: "/avatars/02.png",
    rating: 5,
    comment: "I love how quick and reliable the booking system is. Never had any issues with appointments."
  },
  {
    name: "Emily Davis",
    role: "Teacher",
    image: "/avatars/03.png",
    rating: 5,
    comment: "The variety of services available is amazing. I've booked everything from fitness classes to home repairs."
  }
];

export const featuredProviders = [
  {
    name: "Elite Hair Studio",
    service: "Hair & Beauty",
    rating: 4.9,
    image: "/avatars/04.png",
    reviews: 127
  },
  {
    name: "Dr. Smith Wellness",
    service: "Healthcare", 
    rating: 4.8,
    image: "/avatars/05.png",
    reviews: 89
  },
  {
    name: "FitLife Personal Training",
    service: "Fitness",
    rating: 4.9,
    image: "/avatars/06.png", 
    reviews: 156
  },
  {
    name: "QuickFix Home Services",
    service: "Home Services",
    rating: 4.7,
    image: "/avatars/01.png",
    reviews: 203
  }
];

export const benefits = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book appointments instantly with real-time availability and immediate confirmations."
  },
  {
    icon: Shield,
    title: "Verified Providers",
    description: "All service providers are thoroughly verified and reviewed by our community."
  },
  {
    icon: CreditCard,
    title: "Secure Payments", 
    description: "Your payments are protected with bank-level security and encryption."
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to help you."
  }
]; 