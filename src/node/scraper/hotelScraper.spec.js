const { chromium } = require('playwright');
const { DateTime } = require('luxon');

async function checkHotelAvailability(hotelUrl, checkInDate) {
  const checkOutDate = checkInDate.plus({ days: 1 });
  console.log(`Looking for offers on ${checkInDate}`);

  // Build the URL with correct params
  const params = new URLSearchParams({
    fr: 'hp',
    com: 'box',
    ttl: 'ChooseYourRoom',
    SelectedHotelID: '10121',
    ListHotelIds: '10121',
    CheckIn: checkInDate.toFormat('dd.MM.yyyy'),
    CheckOut: checkOutDate.toFormat('dd.MM.yyyy'),
    'Pax[0].Adults': '2',
    'Pax[0].Children': '1',
    'Pax[0].Infants': '0',
    site: 'dan',
  });
  const fullUrl = `${hotelUrl}/Booking/SearchResults?${params.toString()}`;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(fullUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Wait for dynamic content

    // Click all "Half Board" tabs/buttons
    const halfBoardButtons = await page.$$('button, [role="tab"]');
    for (const btn of halfBoardButtons) {
      const text = await btn.textContent();
      if (text && text.trim().toLowerCase().includes('half board')) {
        await btn.click();
        await page.waitForTimeout(2000); // Wait for prices to update
      }
    }
    await page.screenshot({ path: 'hotel_half_board.png', fullPage: true });

    // Extract prices for Half Board EDAN members only
    const edanPrices = await page.$$eval('div.price-item.club span.sum.rate-ILS', els => els.map(e => e.textContent.trim()));
    console.log('Half Board EDAN Member Prices:', edanPrices);

    let found = false;
    edanPrices.forEach(priceText => {
      const price = parseFloat(priceText.replace(/,/g, ''));
      if (price && price < 2000) {
        console.log(`מצאתי הצעה ב-${priceText} ב-Dan!`);
        found = true;
        // כאן שלח התראה
      }
    });
    if (!found) console.log('אין הצעות מתחת ל-2000 ש"ח');
  } catch (error) {
    console.error('שגיאה:', error);
  }
  finally {
    browser && await browser.close();
  }
}

const now = DateTime.now();
const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
const hotelUrl = 'https://www.danhotels.com';
checkHotelAvailability(hotelUrl, nextFriday);