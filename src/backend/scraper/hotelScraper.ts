import { fattal } from "../../shared/constants/hotelIds";
import { Hotel, HotelChain } from "../../shared/constants/hotelIds";

import { chromium } from 'playwright';
import { DateTime } from 'luxon';
import { URLSearchParams } from "url";
import { Deal } from "../../shared/types";
import { is } from "cheerio/dist/commonjs/api/traversing";



type HotelSearchParams = {
  from: string;
  to: string;
  numOfAdults: number;
  numOfChildren?: number;
  numOfInfants?: number;
  childrenAges?: number[];
  mealPlan?: 'Bed & Breakfast' | 'Half Board' | 'Full Board';
};

type FattalProps = {
  hotel: Hotel;
  searchParams: HotelSearchParams;
};

export type ScrapingResult = {
  hotel: Hotel;
  deal: Deal | null;
  error?: string;
};

// const checkAllDanHotels = async (hotels) => {
//   const now = DateTime.now();
//   const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
//   const hotelUrl = 'https://www.danhotels.com';
  
//   // Get all IDs as a comma-separated string
//   const allIds = DAN.HOTEL_IDS_AND_NAMES.map(h => h.id).join(',');
  
//   const params = new URLSearchParams({
//     fr: 'hp',
//     com: 'box',
//     ttl: 'ChooseYourRoom',
//     SelectedHotelID: DAN.HOTEL_IDS_AND_NAMES[0].id.toString(), // Or any ID
//     ListHotelIds: allIds, // All IDs
//     CheckIn: nextFriday.toFormat('dd.MM.yyyy'),
//     CheckOut: nextFriday.plus({ days: 1 }).toFormat('dd.MM.yyyy'),
//     'Pax[0].Adults': '2',
//     'Pax[0].Children': '1',
//     'Pax[0].Infants': '0',
//     site: 'dan',
//   });

//   const deals = [];

//   for (const hotel of DAN.HOTEL_IDS_AND_NAMES) {
//     params.set('SelectedHotelID', hotel.id.toString())
//     const fullUrl = `${hotelUrl}/Booking/SearchResults?${params.toString()}`;
//     console.log('tries url: ', fullUrl)
    
//     const browser = await chromium.launch();
//     const page = await browser.newPage();
//     try {
//       console.log('checking on hotel: ', hotel.name)
//       await page.goto(fullUrl, { waitUntil: 'networkidle' });
      
//       // Click "Half Board" if needed
//       const halfBoardTab = page.locator('text=Half Board').first();
//       if (await halfBoardTab.isVisible()) {
//         await halfBoardTab.click();
//         await page.waitForTimeout(1000);
//       }
//       else {
//         console.log('no half board options in this hotel, but maybe you can still enjoy a good price...')
//       }
      
//       // Parse prices for each hotel (adjust selectors based on page structure) 
      
//         const priceLocator = page.locator('.sum.rate-ILS').first();
//         if (await priceLocator.isVisible()) {
//           const fullText = await priceLocator.textContent();
//           //console.log('found: ', fullText)
//           const match = fullText.match(/(\d+(?:,\d+)*)/);
//           if (match) {
//             const price = parseFloat(match[1].replace(/,/g, ''));
//             if (price < 2000) {
//               console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
//               deals.push({ name: hotel.name, price: match[1] }); // Collect deal
//             }
//             else {
//               console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
//             }
//           } else {
//             console.log(`No price found for ${hotel.name}`);
//           }
//         } else {
//           console.log(`No price element for ${hotel.name}`);
//         }
//     } catch (error) {
//       console.error('Error:', error.message);
//     } finally {
//       await browser.close();
//     }
//   }

//   if (deals.length > 0) {
//     deals.forEach(deal => console.log(`${deal.name}: ${deal.price} ILS`));
//   } else {
//     console.log('No deals found.');
//   }

//   return deals;
// }

// const checkAllFattalHotels = async () => {
//   const now = DateTime.now();
//   const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
//   const baseUrl = 'https://www.leonardo-hotels.com';
  
//   const deals = []; // Array to collect deals under 2000 ILS

//   for (const hotel of FATTAL.HOTEL_IDS_AND_NAMES) {
//     const params = new URLSearchParams({
//       hotel: hotel.slug,
//       from: nextFriday.toFormat("yyyy-MM-dd'T'00:00:00"), // e.g., 2025-09-19T00:00:00
//       to: nextFriday.plus({ days: 1 }).toFormat("yyyy-MM-dd'T'00:00:00"), // e.g., 2025-09-20T00:00:00
//       stay: 'leisure',
//       redeemPoints: 'false',
//       paxesConfig: 'adults,2,children,1,infants,0,ages,2',
//     });
//     const fullUrl = `${baseUrl}/booking?${params.toString()}`;
//     console.log('Trying URL:', fullUrl);
    
//     const browser = await chromium.launch();
//     const page = await browser.newPage();
//     try {
//       console.log('Checking hotel:', hotel.name);
//       await page.goto(fullUrl, { waitUntil: 'networkidle' });
      
//       // Check if "Half Board" option exists (adjust selector based on site inspection; may be a dropdown or button)
//       const halfBoardPlan = page.locator('app-booking-room-plan').filter({ hasText: 'Half Board' }).first();
//       const priceLocator = halfBoardPlan.locator('.member-only-pay__button app-price span').first();
//       if (await halfBoardPlan.isVisible()) {
//         console.log(`Half Board option available for ${hotel.name}`);
//         await halfBoardPlan.click();
//         await page.waitForTimeout(200);
//       } else {
//         console.log(`No Half Board option for ${hotel.name}, checking regular prices...`);
//         // Take a screenshot to inspect the page structure
//         await page.screenshot({ path: `fattal_${hotel.slug}.png`, fullPage: true });
//       }
      
//       if (await priceLocator.isVisible()) {
//         const fullText = await priceLocator.textContent();
//         const match = fullText.match(/(\d+(?:,\d+)*)/);
//         if (match) {
//           const price = parseFloat(match[1].replace(/,/g, ''));
//           if (price < 2000) {
//             console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
//             deals.push({ name: hotel.name, price: match[1] });
//           } else {
//             console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
//           }
//         } else {
//           console.log(`No price found for ${hotel.name}`);
//         }
//       } else {
//         console.log(`No price element for ${hotel.name}`);
//       }
//     } catch (error) {
//       console.error('Error for', hotel.name, ':', error.message);
//     } finally {
//       await browser.close();
//       await new Promise(resolve => setTimeout(resolve, 200)); // Delay to avoid rate limiting
//     }
//   }

//   // Summary of deals
//   console.log('\nSummary of Fattal deals under 2000 ILS:');
//   if (deals.length > 0) {
//     deals.forEach(deal => console.log(`${deal.name}: ${deal.price} ILS`));
//   } else {
//     console.log('No deals found.');
//   }

//   return deals;
// }

// const scrapeSingleHotel = async ({ hotel, searchParams }: FattalProps) => {
//   const baseUrl = 'https://www.leonardo-hotels.com'; // Note: Fattal is under Leonardo?

//   const paramsObject: Record<string,string> = ({
//     hotel: hotel.slug ?? '',
//     from: searchParams.from ?? '',
//     to: searchParams.to ?? '',
//     stay: 'leisure',
//     redeemPoints: 'false',
//     paxesConfig: `adults,${searchParams.numOfAdults ?? 1},children,${searchParams.numOfChildren ?? 0},infants,${searchParams.numOfInfants ?? 0}${searchParams.childrenAges ? `,ages,${(searchParams.childrenAges || []).join('-')}` : ''}`,
//   });

//   const urlParams = new URLSearchParams(paramsObject);
//   const fullUrl = `${baseUrl}/booking?${urlParams.toString()}`;
  
//   console.log('Trying URL:', fullUrl);
  
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();
  
//   try {
//     console.log('Checking hotel:', hotel.name);
//     await page.goto(fullUrl, { waitUntil: 'networkidle' });
    
//     // Check if "Half Board" option exists
//     const halfBoardPlan = page.locator('app-booking-room-plan').filter({ hasText: 'Half Board' }).first();
//     const priceLocator = halfBoardPlan.locator('.member-only-pay__button app-price span').first();
    
//     if (await halfBoardPlan.isVisible()) {
//       console.log(`Half Board option available for ${hotel.name}`);
//       await halfBoardPlan.click();
//       await page.waitForTimeout(200);
//     } else {
//       console.log(`No Half Board option for ${hotel.name}, checking regular prices...`);
//       //await page.screenshot({ path: `fattal_${hotel.slug}.png`, fullPage: true });
//     }
    
//     if (await priceLocator.isVisible()) {
//       const fullText = await priceLocator.textContent();
//       const match = fullText?.match(/(\d+(?:,\d+)*)/);
//       if (match) {
//         const price = parseFloat(match[1].replace(/,/g, ''));
//         if (price < 2000) {
//           console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
//           return { name: hotel.name, price: match[1] }; // Return deal
//         } else {
//           console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
//         }
//       }
//     } else {
//       console.log(`No price found for ${hotel.name}`);
//     }
    
//     return null; // No deal
//   } catch (error: Error | any) {
//     console.error('Error for', hotel.name, ':', error.message);
//     return null;
//   } finally {
//     await browser.close();
//     await new Promise(resolve => setTimeout(resolve, 200)); // Per-scrape delay for politeness
//   }
// }

const buildPaxConfig = (params: HotelSearchParams): string => {
  const { numOfAdults, numOfChildren = 0, numOfInfants = 0, childrenAges = [] } = params;
  let config = `adults,${numOfAdults},children,${numOfChildren},infants,${numOfInfants}`;
  
  if (childrenAges.length > 0) {
    config += `,ages,${childrenAges.join('-')}`;
  }
  
  return config;
};

const buildSearchUrl = (hotel: Hotel, searchParams: HotelSearchParams): string => {
  const baseUrl = 'https://www.leonardo-hotels.com';
  const params = new URLSearchParams({
    hotel: hotel.slug || '',
    from: searchParams.from,
    to: searchParams.to,
    stay: 'leisure',
    redeemPoints: 'false',
    paxesConfig: buildPaxConfig(searchParams),
  });

  return `${baseUrl}/booking?${params.toString()}`;
};

// Function to try multiple price selectors
const tryExtractPrice = async (page: any, hotel: Hotel): Promise<Deal | null> => {
  const priceSelectors = [
    'app-member-only-pay app-price span',
    '.member-only-pay__button app-price span',
    '.price-value',
    '[data-testid="price"]',
    '.sum.rate-ILS'
  ];

  for (const selector of priceSelectors) {
    const priceLocator = page.locator(selector).first();
    
    if (await priceLocator.isVisible()) {
      const priceText = await priceLocator.textContent();
      const deal = parsePriceForMealPlan(page, hotel, priceText);
      
      if (deal) {
        return deal;
      }
    }
  }

  return null;
};

// Function to handle Meal Plan selection
const isMealPlanAvailable = async (page: any, hotel: Hotel, mealPlan: 'Bed & Breakfast' | 'Half Board' | 'Full Board'): Promise<boolean> => {
  const mealPlanText = mealPlan === 'Full Board' ? 'FULL BOARD' : mealPlan;
  const mealPlanLocator = page.locator('app-booking-room-plan').filter({ hasText: mealPlanText }).first();

  if (await mealPlanLocator.isVisible()) {
    console.log(`✓ ${mealPlan} available for ${hotel.name}`);
    await mealPlanLocator.click();
    await page.waitForTimeout(200);
    return true;
  } else {
    console.log(`ℹ No ${mealPlan} for ${hotel.name}`);
    return false;
  }
};

const parsePriceForMealPlan = async (page: any, hotel: Hotel, mealPlan: string): Promise<Deal | null> => {
  try {
    // Click on the meal plan first
    const mealPlanElement = page.locator('app-booking-room-plan').filter({ 
      hasText: new RegExp(mealPlan, 'i') 
    }).first();
    
    if (await mealPlanElement.isVisible()) {
      await mealPlanElement.click();
      await page.waitForTimeout(1000);
      
      // Try to get price from within the same meal plan element
      // const priceInMealPlan = await mealPlanElement.locator('app-price span, .price-value').first().textContent();
      // if (priceInMealPlan) {
      //   return priceInMealPlan;
      // }
      
      // If not found in meal plan element, try general price selectors after selection
      const generalPriceSelectors = [
        {type: "member", selector: 'app-member-only-pay app-price span'},
        {type: "non-member", selector: 'app-not-member-pay app-price span'},
        //{type: "button", selector: '.member-only-pay__button app-price span'},
      ];
      
      for (const selector of generalPriceSelectors) {
        const priceElement = mealPlanElement.locator(selector.selector).first();
        if (await priceElement.isVisible()) {
          const priceText = await priceElement.textContent();
          if (priceText) {
            const deal = { hotelName: hotel.name, hotelSlug: hotel.slug, price: priceText.trim(), isMemeberPrice: selector.type === "member" };
            return deal;
          }
          else {
            console.log(`ℹ No ${mealPlan} for ${hotel.name}`);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting price for ${mealPlan}:`, error);
    return null;
  }
};

// Main scraping function for a single hotel
export const scrapeSingleHotel = async (hotel: Hotel, searchParams: HotelSearchParams): Promise<ScrapingResult> => {
  const url = buildSearchUrl(hotel, searchParams);
  console.log(`🔍 Checking ${hotel.name}...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    //const isMealAvailable = await isMealPlanAvailable(page, hotel, searchParams.mealPlan || 'Bed & Breakfast');
    //const deal = isMealAvailable ? await tryExtractPrice(page, hotel) : null;
    const deal = await parsePriceForMealPlan(page, hotel, searchParams.mealPlan || 'Bed & Breakfast');

    if (!deal) {
      console.log(`✗ No price found for ${hotel.name}`);
    }

    return { hotel, deal };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error scraping ${hotel.name}: ${errorMessage}`);
    
    return {
      hotel,
      deal: null,
      error: errorMessage,
    };

  } finally {
    await browser.close();
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

// Function to scrape multiple hotels in parallel
export const scrapeMultipleHotels = async (hotels: Hotel[], searchParams: HotelSearchParams): Promise<Deal[]> => {
  console.log(`🚀 Starting to scrape ${hotels.length} hotels...`);

  const promises = hotels.map(hotel => scrapeSingleHotel(hotel, searchParams));
  const results = await Promise.allSettled(promises);

  const deals: Deal[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const { deal, error } = result.value;
      
      if (deal) {
        deals.push(deal);
      } else if (error) {
        errors.push(`${hotels[index].name}: ${error}`);
      }
    } else {
      errors.push(`${hotels[index].name}: ${result.reason}`);
    }
  });

  // Log summary
  console.log(`\n📊 Scraping Complete:`);
  console.log(`✓ Successfully scraped: ${deals.length} hotels`);
  console.log(`✗ Failed: ${errors.length} hotels`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`  ${error}`));
  }

  return deals;
};

// Utility functions for filtering and sorting
export const getHotelsByCity = (cityFilter: string | null = null): Hotel[] => {
  if (cityFilter && fattal.hotelsByCity[cityFilter]) {
    return [...fattal.hotelsByCity[cityFilter]];
  }
  
  return Object.values(fattal.hotelsByCity).flat();
};

export const filterDealsByPrice = (deals: Deal[], maxPrice = 2000): Deal[] => 
  deals.filter(deal => parseFloat(deal.price.replace(/,/g, '')) < maxPrice);

export const sortDealsByPrice = (deals: Deal[]): Deal[] => 
  [...deals].sort((a, b) => parseFloat(a.price.replace(/,/g, '')) - parseFloat(b.price.replace(/,/g, '')));

// Date utility functions
export const getNextFriday = (): DateTime => {
  const now = DateTime.now();
  return now.plus({ days: (5 - now.weekday + 7) % 7 });
};

export const formatForBooking = (date: DateTime): string => 
  date.toFormat("yyyy-MM-dd'T'00:00:00");

// Function to display results
const displayResults = (allDeals: Deal[]): void => {
  if (allDeals.length === 0) {
    console.log('\n😞 No deals found.');
    return;
  }

  // Show all deals sorted by price
  const sortedDeals = sortDealsByPrice(allDeals);
  console.log('\n💰 All Deals (sorted by price):');
  sortedDeals.forEach(deal => 
    console.log(`  ${deal.hotelName}: ${deal.price} ILS`)
  );

  // Show only great deals (under threshold)
  const greatDeals = filterDealsByPrice(allDeals);
  if (greatDeals.length > 0) {
    console.log('\n🎉 Great Deals (under 2000 ILS):');
    sortDealsByPrice(greatDeals).forEach(deal => 
      console.log(`  ${deal.hotelName}: ${deal.price} ILS`)
    );
  }
};

const main = async () => {
  const numOfAdults = 2;
  const numOfChildren = 1;

  const now = DateTime.now();
  const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
  const fromDate = nextFriday.toFormat("yyyy-MM-dd'T'00:00:00");
  const toDate = nextFriday.plus({ days: 1 }).toFormat("yyyy-MM-dd'T'00:00:00");

  const hotelData = fattal as HotelChain;

  const cityFilter = 'telAviv';

  const allHotels: Hotel[] = [];
  if (hotelData.hotelsByCity[cityFilter]) {
    allHotels.push(...hotelData.hotelsByCity[cityFilter]);
  } else {
    Object.values(hotelData.hotelsByCity).forEach((cityHotels: Hotel[]) => {
      allHotels.push(...cityHotels);
    });
  }

  const promises = allHotels.map(hotel => scrapeSingleHotel(hotel, { from: fromDate, to: toDate, numOfAdults, numOfChildren }));
  const results = await Promise.allSettled(promises);

  const deals: Deal[] = [];
  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      if (result.value.deal) {
        deals.push({ hotelName: result.value.deal.hotelName, price: result.value.deal.price });
      }
    }
  });
  //checkAllDanHotels();
  //const deals = await checkAllFattalHotels();
  deals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    .forEach(deal => console.log(`${deal.hotelName}: ${deal.price} ILS`));
}

//main();
