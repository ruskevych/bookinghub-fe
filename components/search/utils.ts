import type { SearchFormData } from "./constants";

export const encodeSearchParams = (formData: SearchFormData): URLSearchParams => {
  const params = new URLSearchParams();
  if (formData.searchQuery.trim()) {
    params.set("query", formData.searchQuery);
  }
  if (formData.location.trim()) {
    params.set("location", formData.location);
  }
  if (formData.categories.length > 0) {
    params.set("categories", formData.categories.join(","));
  }
  if (formData.priceRange[0] !== 0 || formData.priceRange[1] !== 500) {
    params.set("priceMin", formData.priceRange[0].toString());
    params.set("priceMax", formData.priceRange[1].toString());
  }
  if (formData.availability.length > 0) {
    params.set("availability", formData.availability.join(","));
  }
  if (formData.sortBy !== "best-match") {
    params.set("sortBy", formData.sortBy);
  }
  return params;
};

export const decodeSearchParams = (searchParams: URLSearchParams): SearchFormData => {
  return {
    searchQuery: searchParams.get("query") || "",
    location: searchParams.get("location") || "",
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    priceRange: [
      parseInt(searchParams.get("priceMin") || "0"),
      parseInt(searchParams.get("priceMax") || "500"),
    ],
    availability: searchParams.get("availability")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "best-match",
  };
};
