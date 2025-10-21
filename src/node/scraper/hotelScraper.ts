import { fattal } from "../constants/hotelIds";
import { Hotel, HotelChain } from "../constants/hotelIds";

import { chromium } from 'playwright';
import { DateTime } from 'luxon';
import { URLSearchParams } from "url";



type HotelSearchParams = {
  from: string;
  to: string;
  numOfAdults: number;
  numOfChildren?: number;
  numOfInfants?: number;
  childrenAges?: number[];
};

type FattalProps = {
  hotel: Hotel;
  searchParams: HotelSearchParams;
};

type Deal = {
  hotelName: string;
  price: string;
}

const checkAllDanHotels = async (hotels) => {
  const now = DateTime.now();
  const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
  const hotelUrl = 'https://www.danhotels.com';
  
  // Get all IDs as a comma-separated string
  const allIds = DAN.HOTEL_IDS_AND_NAMES.map(h => h.id).join(',');
  
  const params = new URLSearchParams({
    fr: 'hp',
    com: 'box',
    ttl: 'ChooseYourRoom',
    SelectedHotelID: DAN.HOTEL_IDS_AND_NAMES[0].id.toString(), // Or any ID
    ListHotelIds: allIds, // All IDs
    CheckIn: nextFriday.toFormat('dd.MM.yyyy'),
    CheckOut: nextFriday.plus({ days: 1 }).toFormat('dd.MM.yyyy'),
    'Pax[0].Adults': '2',
    'Pax[0].Children': '1',
    'Pax[0].Infants': '0',
    site: 'dan',
  });

  const deals = [];

  for (const hotel of DAN.HOTEL_IDS_AND_NAMES) {
    params.set('SelectedHotelID', hotel.id.toString())
    const fullUrl = `${hotelUrl}/Booking/SearchResults?${params.toString()}`;
    console.log('tries url: ', fullUrl)
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
      console.log('checking on hotel: ', hotel.name)
      await page.goto(fullUrl, { waitUntil: 'networkidle' });
      
      // Click "Half Board" if needed
      const halfBoardTab = page.locator('text=Half Board').first();
      if (await halfBoardTab.isVisible()) {
        await halfBoardTab.click();
        await page.waitForTimeout(1000);
      }
      else {
        console.log('no half board options in this hotel, but maybe you can still enjoy a good price...')
      }
      
      // Parse prices for each hotel (adjust selectors based on page structure) 
      
        const priceLocator = page.locator('.sum.rate-ILS').first();
        if (await priceLocator.isVisible()) {
          const fullText = await priceLocator.textContent();
          //console.log('found: ', fullText)
          const match = fullText.match(/(\d+(?:,\d+)*)/);
          if (match) {
            const price = parseFloat(match[1].replace(/,/g, ''));
            if (price < 2000) {
              console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
              deals.push({ name: hotel.name, price: match[1] }); // Collect deal
            }
            else {
              console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
            }
          } else {
            console.log(`No price found for ${hotel.name}`);
          }
        } else {
          console.log(`No price element for ${hotel.name}`);
        }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      await browser.close();
    }
  }

  if (deals.length > 0) {
    deals.forEach(deal => console.log(`${deal.name}: ${deal.price} ILS`));
  } else {
    console.log('No deals found.');
  }

  return deals;
}

const checkAllFattalHotels = async () => {
  const now = DateTime.now();
  const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
  const baseUrl = 'https://www.leonardo-hotels.com';
  
  const deals = []; // Array to collect deals under 2000 ILS

  for (const hotel of FATTAL.HOTEL_IDS_AND_NAMES) {
    const params = new URLSearchParams({
      hotel: hotel.slug,
      from: nextFriday.toFormat("yyyy-MM-dd'T'00:00:00"), // e.g., 2025-09-19T00:00:00
      to: nextFriday.plus({ days: 1 }).toFormat("yyyy-MM-dd'T'00:00:00"), // e.g., 2025-09-20T00:00:00
      stay: 'leisure',
      redeemPoints: 'false',
      paxesConfig: 'adults,2,children,1,infants,0,ages,2',
    });
    const fullUrl = `${baseUrl}/booking?${params.toString()}`;
    console.log('Trying URL:', fullUrl);
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
      console.log('Checking hotel:', hotel.name);
      await page.goto(fullUrl, { waitUntil: 'networkidle' });
      
      // Check if "Half Board" option exists (adjust selector based on site inspection; may be a dropdown or button)
      const halfBoardPlan = page.locator('app-booking-room-plan').filter({ hasText: 'Half Board' }).first();
      const priceLocator = halfBoardPlan.locator('.member-only-pay__button app-price span').first();
      if (await halfBoardPlan.isVisible()) {
        console.log(`Half Board option available for ${hotel.name}`);
        await halfBoardPlan.click();
        await page.waitForTimeout(200);
      } else {
        console.log(`No Half Board option for ${hotel.name}, checking regular prices...`);
        // Take a screenshot to inspect the page structure
        await page.screenshot({ path: `fattal_${hotel.slug}.png`, fullPage: true });
      }
      
      if (await priceLocator.isVisible()) {
        const fullText = await priceLocator.textContent();
        const match = fullText.match(/(\d+(?:,\d+)*)/);
        if (match) {
          const price = parseFloat(match[1].replace(/,/g, ''));
          if (price < 2000) {
            console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
            deals.push({ name: hotel.name, price: match[1] });
          } else {
            console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
          }
        } else {
          console.log(`No price found for ${hotel.name}`);
        }
      } else {
        console.log(`No price element for ${hotel.name}`);
      }
    } catch (error) {
      console.error('Error for', hotel.name, ':', error.message);
    } finally {
      await browser.close();
      await new Promise(resolve => setTimeout(resolve, 200)); // Delay to avoid rate limiting
    }
  }

  // Summary of deals
  console.log('\nSummary of Fattal deals under 2000 ILS:');
  if (deals.length > 0) {
    deals.forEach(deal => console.log(`${deal.name}: ${deal.price} ILS`));
  } else {
    console.log('No deals found.');
  }

  return deals;
}

const scrapeSingleHotel = async ({ hotel, searchParams }: FattalProps) => {
  const baseUrl = 'https://www.leonardo-hotels.com'; // Note: Fattal is under Leonardo?

  const paramsObject: Record<string,string> = ({
    hotel: hotel.slug ?? '',
    from: searchParams.from ?? '',
    to: searchParams.to ?? '',
    stay: 'leisure',
    redeemPoints: 'false',
    paxesConfig: `adults,${searchParams.numOfAdults ?? 1},children,${searchParams.numOfChildren ?? 0},infants,${searchParams.numOfInfants ?? 0}${searchParams.childrenAges ? `,ages,${(searchParams.childrenAges || []).join('-')}` : ''}`,
  });

  const urlParams = new URLSearchParams(paramsObject);
  const fullUrl = `${baseUrl}/booking?${urlParams.toString()}`;
  
  console.log('Trying URL:', fullUrl);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Checking hotel:', hotel.name);
    await page.goto(fullUrl, { waitUntil: 'networkidle' });
    
    // Check if "Half Board" option exists
    const halfBoardPlan = page.locator('app-booking-room-plan').filter({ hasText: 'Half Board' }).first();
    const priceLocator = halfBoardPlan.locator('.member-only-pay__button app-price span').first();
    
    if (await halfBoardPlan.isVisible()) {
      console.log(`Half Board option available for ${hotel.name}`);
      await halfBoardPlan.click();
      await page.waitForTimeout(200);
    } else {
      console.log(`No Half Board option for ${hotel.name}, checking regular prices...`);
      //await page.screenshot({ path: `fattal_${hotel.slug}.png`, fullPage: true });
    }
    
    if (await priceLocator.isVisible()) {
      const fullText = await priceLocator.textContent();
      const match = fullText?.match(/(\d+(?:,\d+)*)/);
      if (match) {
        const price = parseFloat(match[1].replace(/,/g, ''));
        if (price < 2000) {
          console.log(`Great deal found at ${hotel.name}: ${match[1]} ILS!`);
          return { name: hotel.name, price: match[1] }; // Return deal
        } else {
          console.log(`Found price for ${hotel.name}: ${match[1]} ILS`);
        }
      }
    } else {
      console.log(`No price found for ${hotel.name}`);
    }
    
    return null; // No deal
  } catch (error: Error | any) {
    console.error('Error for', hotel.name, ':', error.message);
    return null;
  } finally {
    await browser.close();
    await new Promise(resolve => setTimeout(resolve, 200)); // Per-scrape delay for politeness
  }
}

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

  const promises = allHotels.map(hotel => scrapeSingleHotel({ hotel, searchParams: { from: fromDate, to: toDate, numOfAdults, numOfChildren } }));
  const results = await Promise.allSettled(promises);

  const deals: Deal[] = [];
  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value) {
      deals.push({ hotelName: result.value.name, price: result.value.price });
    }
  });
  //checkAllDanHotels();
  //const deals = await checkAllFattalHotels();
  deals.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    .forEach(deal => console.log(`${deal.hotelName}: ${deal.price} ILS`));
}

main();
