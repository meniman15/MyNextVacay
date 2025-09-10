const axios = require('axios');
const cheerio = require('cheerio');
const { DateTime } = require('luxon');

async function checkHotelAvailability(hotelUrl, checkInDate) {
  const checkOutDate = checkInDate.plus({ days: 1 });
  console.log(`Looking for offers on ${checkInDate}`);

  const params = {
    check_in: checkInDate.toFormat('yyyy-MM-dd'),
    check_out: checkOutDate.toFormat('yyyy-MM-dd'),
    adults: 2,
    children: 1,
    children_ages: '3', 
    // אם יש פרמטר לחצי פנסיון, להוסיף
  };

  try {
    const response = await axios.get(hotelUrl, { params });
    const data = cheerio.load(response.data);

    const prices = data('span.sum.rate-ILS');
        console.log(prices);
    let found = false;
    prices.each((i, el) => {
      const priceText = data(el).text().trim();
      const price = parseFloat(priceText.replace(/ILS|₪/g, '').trim());
      if (price && price < 2000) {
        console.log(`מצאתי הצעה ב-${priceText} ב-Isrotel!`);
        found = true;
        // כאן שלח התראה
      }
    });
    if (!found) console.log('אין הצעות מתחת ל-2000 ש"ח');
  } catch (error) {
    console.error('שגיאה:', error);
  }
}

const now = DateTime.now();
const nextFriday = now.plus({ days: (5 - now.weekday + 7) % 7 });
const hotelUrl = 'https://www.danhotels.com';
checkHotelAvailability(hotelUrl, nextFriday);