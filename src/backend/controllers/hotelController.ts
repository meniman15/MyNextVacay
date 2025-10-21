import { Request, Response } from 'express';
import { SearchParams, SearchResults } from '../../shared/types';
import { scrapeMultipleHotels, getHotelsByCity, filterDealsByPrice, sortDealsByPrice } from '../scraper/hotelScraper';

export const searchHotels = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const searchParams: SearchParams = req.body;
    
    console.log(`🔍 Starting hotel search:`, {
      city: searchParams.city || 'all cities',
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: `${searchParams.numOfAdults}A/${searchParams.numOfChildren}C`,
      maxPrice: searchParams.maxPrice
    });

    // Get hotels based on search criteria
    const hotels = getHotelsByCity(searchParams.city);
    console.log(`📋 Found ${hotels.length} hotels to check`);

    // Convert frontend params to scraper params
    const scraperParams = {
      from: `${searchParams.checkIn}T00:00:00`,
      to: `${searchParams.checkOut}T00:00:00`,
      numOfAdults: searchParams.numOfAdults,
      numOfChildren: searchParams.numOfChildren,
      numOfInfants: searchParams.numOfInfants || 0,
      childrenAges: searchParams.childrenAges || [],
    };

    // Scrape hotels
    const allDeals = await scrapeMultipleHotels(hotels, scraperParams);
    
    // Process results
    const sortedDeals = sortDealsByPrice(allDeals);
    const greatDeals = searchParams.maxPrice 
      ? filterDealsByPrice(allDeals, searchParams.maxPrice)
      : filterDealsByPrice(allDeals); // Default to 2000

    const results: SearchResults = {
      deals: sortedDeals,
      greatDeals: sortDealsByPrice(greatDeals),
      totalHotelsChecked: hotels.length,
      searchDuration: Date.now() - startTime,
      errors: [] // You can collect errors from the scraping process
    };

    console.log(`✅ Search completed in ${results.searchDuration}ms`);
    console.log(`📊 Results: ${results.deals.length} deals, ${results.greatDeals.length} great deals`);

    res.json(results);

  } catch (error) {
    console.error('❌ Hotel search failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: 'Search failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};

export const getHotelChains = (req: Request, res: Response): void => {
  res.json([
    { id: 'fattal', name: 'Leonardo Hotels (Fattal)', available: true },
    { id: 'dan', name: 'Dan Hotels', available: false }
  ]);
};

export const getCities = (req: Request, res: Response): void => {
  const { chain } = req.params;
  
  // This would be dynamic based on your hotel data
  const cities = {
    fattal: ['jerusalem', 'telAviv', 'eilat', 'haifa', 'herzliya', 'ashdod', 'tiberias', 'rehovot', 'safed'],
    dan: ['jerusalem', 'telAviv', 'eilat', 'haifa', 'herzliya', 'caesarea', 'safed', 'nazareth']
  };

  res.json(cities[chain as keyof typeof cities] || []);
};