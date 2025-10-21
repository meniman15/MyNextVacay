# API Documentation

## Endpoints

### POST /api/search
Search for hotel deals

**Request Body:**
```json
{
  "hotelChain": "fattal",
  "city": "telAviv",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-16",
  "numOfAdults": 2,
  "numOfChildren": 1,
  "numOfInfants": 0,
  "maxPrice": 2000
}
```

**Response:**
```json
{
  "deals": [...],
  "greatDeals": [...],
  "totalHotelsChecked": 15,
  "searchDuration": 45000,
  "errors": []
}
```

### GET /api/chains
Get available hotel chains

### GET /api/cities/:chain
Get available cities for a hotel chain