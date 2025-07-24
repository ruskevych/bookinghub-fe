import { useQuery } from 'urql';

const SEARCH_PROVIDERS_QUERY = `
  query SearchProviders($input: SearchProvidersInput!) {
    searchProviders(input: $input) {
      items {
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
        nextAvailableSlot {
          date
          time
        }
        availabilityWindows {
          today
          tomorrow
          thisWeek
          nextWeek
        }
        location {
          address
          city
          state
          zipCode
          serviceRadius
        }
        verificationStatus {
          isVerified
          backgroundCheck
          phoneVerified
          emailVerified
          licenseVerified
          badges
        }
        businessHours {
          monday { isOpen openTime closeTime }
          tuesday { isOpen openTime closeTime }
          wednesday { isOpen openTime closeTime }
          thursday { isOpen openTime closeTime }
          friday { isOpen openTime closeTime }
          saturday { isOpen openTime closeTime }
          sunday { isOpen openTime closeTime }
        }
        services {
          id
          name
          price
        }
      }
      pagination {
        total
        page
        per_page
        total_pages
        has_next_page
        has_prev_page
      }
      filters {
        categories
        priceRanges
        locations
        availability
      }
    }
  }
`;

type ProviderSearchInput = {
  query?: string;
  categories?: string[];
  location?: string;
  priceRange?: { min?: number; max?: number };
  availability?: string[];
  sortBy?: string;
  limit?: number;
  page?: number;
};

export function useProviderSearch(input: ProviderSearchInput) {
  const [{ data, fetching, error }, refetch] = useQuery({
    query: SEARCH_PROVIDERS_QUERY,
    variables: { input },
    pause: !input,
  });

  return {
    providers: data?.searchProviders?.items ?? [],
    pagination: data?.searchProviders?.pagination ?? null,
    filters: data?.searchProviders?.filters ?? null,
    loading: fetching,
    error,
    refetch,
  };
} 