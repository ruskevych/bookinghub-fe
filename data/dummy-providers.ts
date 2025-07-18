import type { Provider, Review, AvailabilitySlot } from '@/types/provider';

// Mock provider data that simulates backend API responses
export const DUMMY_PROVIDERS: Record<string, Provider> = {
  '1': {
    id: '1',
    name: "Sarah Johnson",
    businessName: "Elite Hair Studio",
    category: "Hair & Beauty",
    email: "sarah@elitehairstudio.com",
    phone: "(555) 123-4567",
    profileImage: "/avatars/01.png",
    bio: "Professional hair stylist with over 10 years of experience. Specializing in modern cuts, color transformations, and bridal styling. I'm passionate about helping my clients look and feel their best.",
    rating: 4.9,
    reviewCount: 156,
    totalReviews: 156,
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
    yearsExperience: 10,
    responseTime: "Usually responds within 1 hour",
    languages: ["English", "Spanish"],
    nextAvailableSlot: {
      date: new Date().toISOString().split('T')[0],
      time: "10:30"
    },
    availabilityWindows: {
      today: true,
      tomorrow: true,
      thisWeek: true,
      nextWeek: false
    },
    location: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      serviceRadius: 25
    },
    services: [
      {
        id: "1",
        name: "Hair Cut & Style",
        description: "Professional haircut with wash and styling",
        duration: 60,
        price: 75,
        category: "Hair",
        images: ["/images/haircut-1.jpg"],
        isPopular: true,
        isAvailable: true
      },
      {
        id: "2",
        name: "Hair Color",
        description: "Full color treatment including consultation",
        duration: 120,
        price: 150,
        category: "Hair",
        images: ["/images/color-1.jpg"],
        isPopular: true,
        isAvailable: true
      },
      {
        id: "3",
        name: "Highlights",
        description: "Partial or full highlights with toning",
        duration: 180,
        price: 200,
        category: "Hair",
        images: ["/images/highlights-1.jpg"],
        isAvailable: true
      },
      {
        id: "4",
        name: "Deep Conditioning Treatment",
        description: "Intensive hair treatment for damaged or dry hair",
        duration: 45,
        price: 65,
        category: "Treatment",
        images: ["/images/treatment-1.jpg"],
        isAvailable: true
      },
      {
        id: "5",
        name: "Bridal Styling",
        description: "Complete bridal hair styling with trial session",
        duration: 90,
        price: 250,
        category: "Special Event",
        images: ["/images/bridal-1.jpg"],
        isPopular: true,
        isAvailable: true
      }
    ],
    availability: [],
    reviews: [],
    gallery: [
      {
        id: "1",
        url: "/images/gallery-1.jpg",
        caption: "Recent color transformation",
        category: "before_after",
        isMain: true
      },
      {
        id: "2",
        url: "/images/gallery-2.jpg",
        caption: "Modern cut and style",
        category: "portfolio"
      },
      {
        id: "3",
        url: "/images/gallery-3.jpg",
        caption: "Salon workspace",
        category: "workspace"
      },
      {
        id: "4",
        url: "/images/gallery-4.jpg",
        caption: "Professional certification",
        category: "certificates"
      },
      {
        id: "5",
        url: "/images/gallery-5.jpg",
        caption: "Bridal styling work",
        category: "portfolio"
      },
      {
        id: "6",
        url: "/images/gallery-6.jpg",
        caption: "Before and after highlights",
        category: "before_after"
      }
    ],
    verificationStatus: {
      isVerified: true,
      backgroundCheck: true,
      phoneVerified: true,
      emailVerified: true,
      licenseVerified: true,
      badges: ["Top Rated", "Quick Response", "Professional"]
    },
    businessHours: {
      monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
      friday: { isOpen: true, openTime: "09:00", closeTime: "19:00" },
      saturday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      sunday: { isOpen: false }
    },
    socialMedia: {
      website: "https://elitehairstudio.com",
      instagram: "@elitehairstudio",
      facebook: "Elite Hair Studio NYC"
    },
    certifications: [
      {
        id: "1",
        name: "Advanced Color Specialist",
        issuer: "Aveda Institute",
        issueDate: "2023-01-15",
        isVerified: true
      },
      {
        id: "2",
        name: "Bridal Styling Certification",
        issuer: "Paul Mitchell Academy",
        issueDate: "2022-08-20",
        expiryDate: "2025-08-20",
        isVerified: true
      }
    ]
  },
  
  '2': {
    id: '2',
    name: "Michael Chen",
    businessName: "Precision Auto Repair",
    category: "Automotive",
    email: "mike@precisionauto.com",
    phone: "(555) 987-6543",
    profileImage: "/avatars/02.png",
    bio: "ASE certified mechanic with 15+ years of experience in automotive repair and maintenance. Specializing in European vehicles and performance tuning.",
    rating: 4.8,
    reviewCount: 89,
    totalReviews: 89,
    startingPrice: 85,
    distance: "1.2 miles",
    image: "/avatars/02.png",
    available: "Next available: Tomorrow",
    isFavorite: false,
    description: "Expert automotive repair and maintenance",
    address: "456 Auto Blvd",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    yearsExperience: 15,
    responseTime: "Usually responds within 2 hours",
    languages: ["English", "Mandarin"],
    nextAvailableSlot: {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: "09:00"
    },
    availabilityWindows: {
      today: false,
      tomorrow: true,
      thisWeek: true,
      nextWeek: true
    },
    location: {
      address: "456 Auto Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      serviceRadius: 30
    },
    services: [
      {
        id: "6",
        name: "Oil Change",
        description: "Full synthetic oil change with filter replacement",
        duration: 30,
        price: 85,
        category: "Maintenance",
        images: ["/images/oil-change.jpg"],
        isPopular: true,
        isAvailable: true
      },
      {
        id: "7",
        name: "Brake Service",
        description: "Complete brake inspection and pad replacement",
        duration: 120,
        price: 275,
        category: "Repair",
        images: ["/images/brake-service.jpg"],
        isPopular: true,
        isAvailable: true
      },
      {
        id: "8",
        name: "Engine Diagnostic",
        description: "Computer diagnostic scan and analysis",
        duration: 60,
        price: 120,
        category: "Diagnostic",
        images: ["/images/diagnostic.jpg"],
        isAvailable: true
      }
    ],
    availability: [],
    reviews: [],
    gallery: [
      {
        id: "7",
        url: "/images/auto-gallery-1.jpg",
        caption: "Modern diagnostic equipment",
        category: "workspace"
      },
      {
        id: "8",
        url: "/images/auto-gallery-2.jpg",
        caption: "Engine repair work",
        category: "portfolio"
      },
      {
        id: "9",
        url: "/images/auto-gallery-3.jpg",
        caption: "ASE Certification",
        category: "certificates"
      }
    ],
    verificationStatus: {
      isVerified: true,
      backgroundCheck: true,
      phoneVerified: true,
      emailVerified: true,
      licenseVerified: true,
      badges: ["ASE Certified", "Reliable", "Fair Pricing"]
    },
    businessHours: {
      monday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      tuesday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      wednesday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      thursday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      friday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      saturday: { isOpen: true, openTime: "09:00", closeTime: "15:00" },
      sunday: { isOpen: false }
    },
    socialMedia: {
      website: "https://precisionautorepair.com"
    },
    certifications: [
      {
        id: "3",
        name: "ASE Master Technician",
        issuer: "National Institute for Automotive Service Excellence",
        issueDate: "2020-05-10",
        expiryDate: "2025-05-10",
        isVerified: true
      }
    ]
  }
};

// Mock reviews data organized by provider ID
export const DUMMY_REVIEWS: Record<string, Review[]> = {
  '1': [
    {
      id: "1",
      customerId: "user1",
      customerName: "Emily Chen",
      customerAvatar: "/avatars/02.png",
      rating: 5,
      comment: "Amazing experience! Sarah really listened to what I wanted and delivered exactly that. The salon is clean and professional.",
      serviceId: "1",
      serviceName: "Hair Cut & Style",
      createdAt: new Date('2024-01-15'),
      verified: true,
      helpful: 12
    },
    {
      id: "2",
      customerId: "user2",
      customerName: "Maria Rodriguez",
      rating: 5,
      comment: "Best color I've ever had! Sarah is incredibly talented and professional. Highly recommend!",
      serviceId: "2",
      serviceName: "Hair Color",
      createdAt: new Date('2024-01-10'),
      verified: true,
      helpful: 8,
      providerResponse: {
        message: "Thank you so much Maria! It was a pleasure working with you.",
        createdAt: new Date('2024-01-11')
      }
    },
    {
      id: "3",
      customerId: "user3",
      customerName: "Jessica Park",
      customerAvatar: "/avatars/03.png",
      rating: 5,
      comment: "Perfect bridal styling! Sarah made me feel absolutely beautiful on my wedding day. She's a true artist.",
      serviceId: "5",
      serviceName: "Bridal Styling",
      createdAt: new Date('2024-01-05'),
      verified: true,
      helpful: 15,
      providerResponse: {
        message: "It was such an honor to be part of your special day! Congratulations!",
        createdAt: new Date('2024-01-06')
      }
    },
    {
      id: "4",
      customerId: "user4",
      customerName: "Amanda Wilson",
      rating: 4,
      comment: "Great service overall. The highlights turned out beautiful, though the appointment ran a bit longer than expected.",
      serviceId: "3",
      serviceName: "Highlights",
      createdAt: new Date('2023-12-28'),
      verified: true,
      helpful: 6
    },
    {
      id: "5",
      customerId: "user5",
      customerName: "Lisa Thompson",
      customerAvatar: "/avatars/04.png",
      rating: 5,
      comment: "Sarah saved my damaged hair! The deep conditioning treatment worked wonders. Will definitely be back.",
      serviceId: "4",
      serviceName: "Deep Conditioning Treatment",
      createdAt: new Date('2023-12-20'),
      verified: true,
      helpful: 9
    }
  ],
  
  '2': [
    {
      id: "6",
      customerId: "user6",
      customerName: "David Kim",
      customerAvatar: "/avatars/05.png",
      rating: 5,
      comment: "Mike is fantastic! Fixed my brake issue quickly and explained everything clearly. Very trustworthy mechanic.",
      serviceId: "7",
      serviceName: "Brake Service",
      createdAt: new Date('2024-01-12'),
      verified: true,
      helpful: 7
    },
    {
      id: "7",
      customerId: "user7",
      customerName: "Robert Martinez",
      rating: 4,
      comment: "Good service for oil change. Quick and professional. Pricing is fair for the quality of work.",
      serviceId: "6",
      serviceName: "Oil Change",
      createdAt: new Date('2024-01-08'),
      verified: true,
      helpful: 4
    },
    {
      id: "8",
      customerId: "user8",
      customerName: "Steve Johnson",
      customerAvatar: "/avatars/06.png",
      rating: 5,
      comment: "Excellent diagnostic work! Mike identified the problem immediately and fixed it at a reasonable price.",
      serviceId: "8",
      serviceName: "Engine Diagnostic",
      createdAt: new Date('2023-12-30'),
      verified: true,
      helpful: 11,
      providerResponse: {
        message: "Thanks Steve! Always happy to help get you back on the road safely.",
        createdAt: new Date('2023-12-31')
      }
    }
  ]
};

// Function to generate mock availability data
export function generateMockAvailability(providerId: string): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();
  const provider = DUMMY_PROVIDERS[providerId];
  
  if (!provider) return slots;
  
  for (let day = 0; day < 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Get business hours for this day
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof provider.businessHours;
    const dayHours = provider.businessHours[dayName];
    
    // Skip if closed
    if (!dayHours.isOpen) continue;
    
    const openHour = parseInt(dayHours.openTime.split(':')[0]);
    const closeHour = parseInt(dayHours.closeTime.split(':')[0]);
    
    // Generate hourly slots during business hours
    for (let hour = openHour; hour < closeHour; hour++) {
      // Skip lunch break (12-1 PM) for service providers
      if (hour === 12 && provider.category !== 'Automotive') continue;
      
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const endTimeString = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Randomly mark some slots as busy (more likely for popular providers)
      const busyChance = provider.rating > 4.7 ? 0.4 : 0.2;
      const status = Math.random() < busyChance ? 'busy' : 'available';
      
      slots.push({
        id: `${providerId}-${dateString}-${timeString}`,
        date: dateString,
        startTime: timeString,
        endTime: endTimeString,
        status: status as 'available' | 'busy'
      });
    }
  }
  
  return slots;
}

// Helper function to get provider by ID
export function getDummyProvider(providerId: string): Provider | null {
  return DUMMY_PROVIDERS[providerId] || null;
}

// Helper function to get reviews for a provider
export function getDummyReviews(providerId: string): Review[] {
  return DUMMY_REVIEWS[providerId] || [];
}

// Helper function to get all provider IDs
export function getAllProviderIds(): string[] {
  return Object.keys(DUMMY_PROVIDERS);
} 