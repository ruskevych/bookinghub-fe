import type { ServiceProvider } from '@/hooks/use-search';

export interface Provider extends ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  bio: string;
  rating: number;
  totalReviews: number;
  yearsExperience: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    serviceRadius: number;
  };
  services: Service[];
  availability: AvailabilitySlot[];
  reviews: Review[];
  gallery: GalleryImage[];
  verificationStatus: VerificationStatus;
  businessHours: BusinessHours;
  socialMedia?: SocialMedia;
  responseTime?: string;
  languages?: string[];
  certifications?: Certification[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  images: string[];
  isPopular?: boolean;
  isAvailable?: boolean;
  requirements?: string[];
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  serviceId: string;
  serviceName: string;
  createdAt: Date;
  verified: boolean;
  helpful?: number;
  providerResponse?: {
    message: string;
    createdAt: Date;
  };
}

export interface AvailabilitySlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'available' | 'busy' | 'blocked';
  serviceId?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: 'before_after' | 'portfolio' | 'workspace' | 'certificates';
  isMain?: boolean;
}

export interface VerificationStatus {
  isVerified: boolean;
  backgroundCheck: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  licenseVerified: boolean;
  badges: string[];
}

export interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime?: string; // HH:MM
    closeTime?: string; // HH:MM
    breaks?: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
}

export interface SocialMedia {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  isVerified: boolean;
}

export interface BookingRequest {
  serviceId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface ProviderStats {
  totalBookings: number;
  completedBookings: number;
  cancelationRate: number;
  averageResponseTime: string;
  repeatCustomerRate: number;
} 