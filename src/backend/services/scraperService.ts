import { SearchParams } from '../../shared/types/index.js';
import { 
  scrapeMultipleHotels, 
  getHotelsByCity, 
  filterDealsByPrice, 
  sortDealsByPrice 
} from '../../backend/scraper/hotelScraper.js';

export const performHotelSearch = async (searchParams: SearchParams) => {
  const startTime = Date.now();
  
  // Get hotels based on search criteria
  const hotels = getHotelsByCity(searchParams.city);
  
  // Convert frontend params to scraper params  
  const scraperParams = {
    from: `${searchParams.checkIn}T00:00:00`,
    to: `${searchParams.checkOut}T00:00:00`,
    numOfAdults: searchParams.numOfAdults,
    numOfChildren: searchParams.numOfChildren,
    numOfInfants: searchParams.numOfInfants || 0,
    childrenAges: searchParams.childrenAges || [],
  };

  // Perform the scraping
  const allDeals = await scrapeMultipleHotels(hotels, scraperParams);
  
  // Process results
  const sortedDeals = sortDealsByPrice(allDeals);
  const greatDeals = searchParams.maxPrice 
    ? filterDealsByPrice(allDeals, searchParams.maxPrice)
    : filterDealsByPrice(allDeals);

  return {
    deals: sortedDeals,
    greatDeals: sortDealsByPrice(greatDeals),
    totalHotelsChecked: hotels.length,
    searchDuration: Date.now() - startTime,
    errors: []
  };
};