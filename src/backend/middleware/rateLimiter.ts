import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs (scraping is expensive)
  message: {
    error: 'Too many search requests',
    message: 'Please wait 15 minutes before searching again',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});