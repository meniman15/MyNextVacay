export interface SearchParams {
  hotelChain: 'fattal' | 'dan';
  city: string | null;
  checkIn: string;
  checkOut: string;
  numOfAdults: number;
  numOfChildren: number;
  numOfInfants: number;
  childrenAges?: number[];
  maxPrice?: number;
  mealPlan?: 'Bed & Breakfast' | 'Half Board' | 'Full Board';
}

export interface Deal {
  hotelName: string;
  price: string;
  isMemeberPrice?: boolean;
  hotelSlug?: string;
  city?: string;
}

export interface SearchResults {
  deals: Deal[];
  greatDeals: Deal[];
  totalHotelsChecked: number;
  searchDuration: number;
  errors: string[];
}