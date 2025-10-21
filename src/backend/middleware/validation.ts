import { Request, Response, NextFunction } from 'express';

export const validateSearchParams = (req: Request, res: Response, next: NextFunction): void => {
  const { checkIn, checkOut, numOfAdults } = req.body;

  // Required fields
  if (!checkIn || !checkOut || !numOfAdults) {
    res.status(400).json({
      error: 'Missing required fields',
      required: ['checkIn', 'checkOut', 'numOfAdults']
    });
    return;
  }

  // Date validation
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    res.status(400).json({
      error: 'Check-in date cannot be in the past'
    });
    return;
  }

  if (checkOutDate <= checkInDate) {
    res.status(400).json({
      error: 'Check-out date must be after check-in date'
    });
    return;
  }

  // Guest validation
  if (numOfAdults < 1 || numOfAdults > 10) {
    res.status(400).json({
      error: 'Number of adults must be between 1 and 10'
    });
    return;
  }

  next();
};