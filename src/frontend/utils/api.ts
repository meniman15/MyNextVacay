
import axios from 'axios';
import { SearchParams, SearchResults } from '../../shared/types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export const searchHotelsApi = async (params: SearchParams): Promise<SearchResults> => {
  const response = await axios.post(`${API_BASE_URL}/search`, params, {
    timeout: 300000, // 5 minutes for scraping
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};

export const getHotelChainsApi = async () => {
  const response = await axios.get(`${API_BASE_URL}/chains`);
  return response.data;
};

export const getCitiesApi = async (chain: string) => {
  const response = await axios.get(`${API_BASE_URL}/cities/${chain}`);
  return response.data;
};