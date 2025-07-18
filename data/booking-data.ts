import { 
  DUMMY_PROVIDERS, 
  generateMockAvailability, 
  getDummyProvider 
} from './dummy-providers';
import { SERVICE_CATEGORIES } from './dummy-ui-data';
import { ExtendedService, AddOnService, StaffMember } from '@/types/booking';
import { TimeSlot } from '@/lib/api';

// Convert provider services to ExtendedService format
export function getAllServices(): ExtendedService[] {
  const allServices: ExtendedService[] = [];
  
  Object.values(DUMMY_PROVIDERS).forEach(provider => {
    provider.services.forEach(service => {
      const extendedService: ExtendedService = {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        business_id: provider.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        provider_name: provider.businessName,
        provider_rating: provider.rating,
        provider_image: provider.profileImage,
        add_ons: generateAddOnsForService(service.category)
      };
      
      allServices.push(extendedService);
    });
  });
  
  return allServices;
}

// Generate add-ons based on service category
function generateAddOnsForService(category: string): AddOnService[] {
  const addOnsByCategory: Record<string, AddOnService[]> = {
    'Hair': [
      { 
        id: 'hair_addon_1', 
        name: 'Deep Conditioning Treatment', 
        description: 'Nourishing treatment for healthier hair', 
        price: 25, 
        duration: 20 
      },
      { 
        id: 'hair_addon_2', 
        name: 'Scalp Massage', 
        description: 'Relaxing scalp massage with essential oils', 
        price: 15, 
        duration: 10 
      },
      { 
        id: 'hair_addon_3', 
        name: 'Hair Styling', 
        description: 'Professional blow-dry and styling', 
        price: 35, 
        duration: 30 
      }
    ],
    'Maintenance': [
      { 
        id: 'auto_addon_1', 
        name: 'Tire Rotation', 
        description: 'Rotate tires for even wear', 
        price: 30, 
        duration: 15 
      },
      { 
        id: 'auto_addon_2', 
        name: 'Fluid Top-off', 
        description: 'Check and top-off all fluids', 
        price: 15, 
        duration: 10 
      }
    ],
    'Repair': [
      { 
        id: 'auto_addon_3', 
        name: 'Multi-point Inspection', 
        description: 'Comprehensive vehicle inspection', 
        price: 45, 
        duration: 30 
      },
      { 
        id: 'auto_addon_4', 
        name: 'Extended Warranty', 
        description: '6-month warranty on parts and labor', 
        price: 75, 
        duration: 0 
      }
    ],
    'Treatment': [
      { 
        id: 'hair_addon_4', 
        name: 'Keratin Treatment', 
        description: 'Smooth and strengthen hair', 
        price: 50, 
        duration: 45 
      }
    ],
    'Special Event': [
      { 
        id: 'hair_addon_5', 
        name: 'Trial Session', 
        description: 'Practice session before the event', 
        price: 100, 
        duration: 60 
      },
      { 
        id: 'hair_addon_6', 
        name: 'Travel Fee', 
        description: 'On-location service fee', 
        price: 50, 
        duration: 0 
      }
    ]
  };
  
  return addOnsByCategory[category] || [];
}

// Get staff members for a provider
export function getStaffMembersForProvider(providerId: string): StaffMember[] {
  const provider = getDummyProvider(providerId);
  if (!provider) return [];
  
  // For now, create mock staff based on the provider
  // In a real app, this would come from the backend
  const staff: StaffMember[] = [
    {
      id: `${providerId}_staff_1`,
      name: provider.name,
      image: provider.profileImage,
      specialties: provider.services.map(s => s.category),
      rating: provider.rating,
      reviews_count: provider.reviewCount,
      available_times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    }
  ];
  
  // Add additional staff members for larger businesses
  if (provider.reviewCount > 100) {
    staff.push({
      id: `${providerId}_staff_2`,
      name: 'Assistant Specialist',
      specialties: [provider.services[0]?.category || 'General'],
      rating: provider.rating - 0.1,
      reviews_count: Math.floor(provider.reviewCount / 3),
      available_times: ['10:00', '11:00', '13:00', '14:00', '15:00', '17:00']
    });
  }
  
  return staff;
}

// Get all staff members across all providers
export function getAllStaffMembers(): StaffMember[] {
  const allStaff: StaffMember[] = [];
  
  Object.keys(DUMMY_PROVIDERS).forEach(providerId => {
    const providerStaff = getStaffMembersForProvider(providerId);
    allStaff.push(...providerStaff);
  });
  
  return allStaff;
}

// Generate time slots for a service on a specific date
export function generateTimeSlots(serviceId: string, date: Date): TimeSlot[] {
  // Find the provider for this service
  const service = getAllServices().find(s => s.id === serviceId);
  if (!service || !service.business_id) return [];
  
  const provider = getDummyProvider(service.business_id);
  if (!provider) return [];
  
  const slots: TimeSlot[] = [];
  const dateString = date.toISOString().split('T')[0];
  const dayOfWeek = date.getDay();
  
  // Get business hours for this day
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof provider.businessHours;
  const dayHours = provider.businessHours[dayName];
  
  // Skip if closed or no hours defined
  if (!dayHours.isOpen || !dayHours.openTime || !dayHours.closeTime) return slots;
  
  const openHour = parseInt(dayHours.openTime.split(':')[0]);
  const closeHour = parseInt(dayHours.closeTime.split(':')[0]);
  const serviceDurationHours = Math.ceil(service.duration / 60);
  
  // Generate time slots that fit the service duration
  for (let hour = openHour; hour <= closeHour - serviceDurationHours; hour++) {
    // Skip lunch break (12-1 PM) for most services
    if (hour === 12 && provider.category !== 'Automotive') continue;
    
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);
    
    // Randomly mark some slots as busy (more likely for popular providers)
    const busyChance = provider.rating > 4.7 ? 0.3 : 0.15;
    const isAvailable = Math.random() > busyChance;
    
    slots.push({
      id: `${serviceId}_${dateString}_${hour}`,
      service_id: serviceId,
      business_id: service.business_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      is_available: isAvailable,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return slots;
}

// Filter services by category
export function filterServicesByCategory(services: ExtendedService[], category: string): ExtendedService[] {
  if (category === 'All Services') return services;
  
  const categoryMap: Record<string, string[]> = {
    'Beauty & Hair': ['Hair', 'Treatment', 'Special Event'],
    'Automotive': ['Maintenance', 'Repair', 'Diagnostic'],
    'Wellness & Spa': ['Massage', 'Spa', 'Wellness'],
    'Business & Consulting': ['Consultation', 'Business'],
    'Health & Fitness': ['Fitness', 'Health'],
    'Home Services': ['Cleaning', 'Maintenance', 'Repair']
  };
  
  const serviceCategories = categoryMap[category] || [];
  if (serviceCategories.length === 0) return services;
  
  return services.filter(service => {
    // Check if any service category matches
    return Object.values(DUMMY_PROVIDERS).some(provider => 
      provider.services.some(providerService => 
        providerService.id === service.id && 
        serviceCategories.includes(providerService.category)
      )
    );
  });
}

// Search services by query
export function searchServices(services: ExtendedService[], query: string): ExtendedService[] {
  if (!query.trim()) return services;
  
  const searchTerm = query.toLowerCase();
  return services.filter(service => 
    service.name.toLowerCase().includes(searchTerm) ||
    (service.description?.toLowerCase().includes(searchTerm)) ||
    (service.provider_name?.toLowerCase().includes(searchTerm))
  );
}

// Get service categories for filtering
export function getServiceCategories(): string[] {
  return [
    'All Services',
    'Beauty & Hair', 
    'Automotive',
    'Wellness & Spa',
    'Business & Consulting',
    'Health & Fitness',
    'Home Services'
  ];
}

// Get services for a specific provider
export function getServicesForProvider(providerId: string): ExtendedService[] {
  const provider = getDummyProvider(providerId);
  if (!provider) return [];
  
  return provider.services.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    business_id: provider.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    provider_name: provider.businessName,
    provider_rating: provider.rating,
    provider_image: provider.profileImage,
    add_ons: generateAddOnsForService(service.category)
  }));
}

// Get provider information by ID
export function getProviderInfo(providerId: string) {
  return getDummyProvider(providerId);
} 