// src/frontend/hooks/useHotelSearch.ts
import { useState } from 'react';
import { SearchParams, SearchResults } from '../../shared/types';
import { searchHotelsApi } from '../utils/api';

export const useHotelSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    hotelChain: 'fattal',
    city: null,
    checkIn: '',
    checkOut: '',
    numOfAdults: 2,
    numOfChildren: 1,
    numOfInfants: 0,
    maxPrice: 2000
  });

  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHotels = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchHotelsApi(searchParams);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
  };

  return {
    searchParams,
    setSearchParams,
    results,
    isLoading,
    error,
    searchHotels,
    reset
  };
};