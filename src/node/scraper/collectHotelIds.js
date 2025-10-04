const axios = require('axios');
const cheerio = require('cheerio');

// Inner function: tries to collect hotel data for a given ID
async function collectHotelData(hotelId) {
  const hotelUrl = 'https://www.danhotels.com';
  const params = new URLSearchParams({
    fr: 'hp',
    com: 'box',
    ttl: 'ChooseYourRoom',
    SelectedHotelID: hotelId.toString(),
    ListHotelIds: hotelId.toString(),
    CheckIn: '12.09.2025',
    CheckOut: '13.09.2025',
    'Pax[0].Adults': '2',
    'Pax[0].Children': '1',
    'Pax[0].Infants': '0',
    site: 'dan',
  });
  const fullUrl = `${hotelUrl}/Booking/SearchResults?${params.toString()}`;

  try {
    console.log(`Processing hotel ID: ${hotelId}`);
    const response = await axios.get(fullUrl, { timeout: 8000 });
    const $ = cheerio.load(response.data);

    // Check for "website error" in the page
    const pageText = $.text().toLowerCase();
    if (pageText.includes('website error')) {
      return null; // Failed
    }

    // Extract hotel name
    const hotelName = $('div.header-hotel-info a').text().trim();
    return hotelName ? hotelName : null;
  } catch (error) {
    return null; // Failed
  }
}

// Outer function: runs the inner function for IDs 10000-10750
async function collectAllHotelIds() {
  const results = [];
  for (let hotelId = 10000; hotelId <= 10750; hotelId++) {
    const hotelName = await collectHotelData(hotelId);
    if (hotelName) {
      results.push({ id: hotelId, name: hotelName });
      console.log(`Found: ID ${hotelId} - ${hotelName}`);
    }
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  return results;
}

// Run the outer function
collectAllHotelIds().then(results => {
  console.log('All found hotels:', results);
}).catch(error => {
  console.error('Error:', error);
});