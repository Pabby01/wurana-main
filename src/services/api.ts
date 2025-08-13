// Placeholder API configuration (to be implemented)
type ServiceListing = Record<string, unknown>;

export const fetchGigs = async (): Promise<any[]> => {
  // TODO: Implement gig fetching from Solana indexer
  return [];
};

export const fetchGigDetails = async (gigId: string): Promise<any> => {
  // TODO: Implement gig details fetching
  return null;
};

// Type definitions
interface GigFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}