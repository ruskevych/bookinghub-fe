import { useQuery } from 'urql';
import type { Provider, Review, AvailabilitySlot } from '@/types/provider';

export interface UseProviderOptions {
  providerId: string;
  includeReviews?: boolean;
  includeAvailability?: boolean;
  includeGallery?: boolean;
}

export interface UseProviderReturn {
  provider: Provider | null;
  reviews: Review[];
  availability: AvailabilitySlot[];
  isLoading: boolean;
  error: string | null;
  refreshProvider: () => void;
}

const GET_PROVIDER_QUERY = `
  query GetProvider($id: ID!, $includeReviews: Boolean = true, $includeAvailability: Boolean = true, $includeGallery: Boolean = true) {
    provider(id: $id) {
      id
      name
      email
      phone
      profileImage
      bio
      rating
      totalReviews
      yearsExperience
      businessName
      category
      startingPrice
      distance
      available
      isFavorite
      description
      address
      city
      state
      zipCode
      responseTime
      languages
      nextAvailableSlot { date time }
      availabilityWindows { today tomorrow thisWeek nextWeek }
      location { address city state zipCode serviceRadius }
      verificationStatus { isVerified backgroundCheck phoneVerified emailVerified licenseVerified badges }
      businessHours {
        monday { isOpen openTime closeTime }
        tuesday { isOpen openTime closeTime }
        wednesday { isOpen openTime closeTime }
        thursday { isOpen openTime closeTime }
        friday { isOpen openTime closeTime }
        saturday { isOpen openTime closeTime }
        sunday { isOpen openTime closeTime }
      }
      services { id name price }
      reviews @include(if: $includeReviews) {
        id
        customerId
        customerName
        customerAvatar
        rating
        comment
        serviceId
        serviceName
        createdAt
        verified
        helpful
        providerResponse { message createdAt }
      }
      availability @include(if: $includeAvailability) {
        id
        date
        startTime
        endTime
        status
        serviceId
      }
      gallery @include(if: $includeGallery) {
        id
        url
        caption
        category
        isMain
      }
      certifications {
        id
        name
        issuer
        issueDate
        expiryDate
        credentialId
        isVerified
      }
      socialMedia {
        website
        facebook
        instagram
        twitter
        linkedin
        youtube
      }
    }
  }
`;

export function useProvider({
  providerId,
  includeReviews = true,
  includeAvailability = true,
  includeGallery = true
}: UseProviderOptions): UseProviderReturn {
  const [{ data, fetching, error }, refetch] = useQuery({
    query: GET_PROVIDER_QUERY,
    variables: { id: providerId, includeReviews, includeAvailability, includeGallery },
    pause: !providerId,
  });

  const provider = data?.provider ?? null;
  const reviews = provider?.reviews ?? [];
  const availability = provider?.availability ?? [];

  return {
    provider,
    reviews,
    availability,
    isLoading: fetching,
    error: error ? error.message : null,
    refreshProvider: refetch,
  };
} 