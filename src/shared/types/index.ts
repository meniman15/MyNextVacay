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
}

export interface Deal {
  hotelName: string;
  price: string;
}

export interface SearchResults {
  deals: Deal[];
  greatDeals: Deal[];
  totalHotelsChecked: number;
  searchDuration: number;
  errors: string[];
}