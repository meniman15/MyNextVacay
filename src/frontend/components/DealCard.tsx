// src/frontend/components/DealCard.tsx
import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Deal, SearchParams } from '../../shared/types';

interface DealCardProps {
  deal: Deal;
  isGreatDeal: boolean;
  searchParams: SearchParams;
}

const DealCard: React.FC<DealCardProps> = ({ deal, isGreatDeal, searchParams }) => {
  const generateBookingUrl = (hotelSlug: string) => {
    const baseUrl = 'https://www.leonardo-hotels.com';
    const params = new URLSearchParams({
      hotel: hotelSlug,
      from: `${searchParams.checkIn}T00:00:00`,
      to: `${searchParams.checkOut}T00:00:00`,
      stay: 'leisure',
      redeemPoints: 'false',
      paxesConfig: `adults,${searchParams.numOfAdults},children,${searchParams.numOfChildren},infants,${searchParams.numOfInfants || 0}`,
    });
    return `${baseUrl}/booking?${params.toString()}`;
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg ${
      isGreatDeal 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {deal.hotelName}
            </h4>
            {isGreatDeal && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                Great Deal
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            {searchParams.mealPlan} • Family Friendly • {deal.city}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ₪{deal.price}
              </div>
              <div className="text-sm text-gray-500">
                per night • includes {searchParams.mealPlan}
              </div>
            </div>
            
            <a
              href={generateBookingUrl(deal.hotelSlug || '')}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isGreatDeal
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Book Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;