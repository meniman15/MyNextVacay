import express from 'express';
import { searchHotels, getHotelChains, getCities } from '../controllers/hotelController.js';
import { validateSearchParams } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// Hotel search endpoint
router.post('/search', validateSearchParams, searchHotels);

// Get available hotel chains
router.get('/chains', getHotelChains);

// Get available cities for a chain
router.get('/cities/:chain', getCities);

// Get search status (for long-running searches)
router.get('/search/:searchId/status', (req, res) => {
  // This could be used for WebSocket or polling-based status updates
  res.json({ status: 'pending', progress: 0 });
});

export default router;