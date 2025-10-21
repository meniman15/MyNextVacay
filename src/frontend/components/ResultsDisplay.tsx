// src/frontend/components/ResultsDisplay.tsx
import React from 'react';
import { MapPin, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { SearchResults, SearchParams } from '../../shared/types';
import DealCard from './DealCard';

interface ResultsDisplayProps {
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  isLoading,
  error,
  searchParams
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for the best deals...</p>
        <p className="text-sm text-gray-500">This may take a minute</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-red-800">Search Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            {results.deals.length} deals found
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {searchParams.city 
                ? searchParams.city.charAt(0).toUpperCase() + searchParams.city.slice(1)
                : 'All Cities'
              }
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {formatDate(searchParams.checkIn)} - {formatDate(searchParams.checkOut)}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {searchParams.numOfAdults} adults
              {searchParams.numOfChildren > 0 && `, ${searchParams.numOfChildren} children`}
              {searchParams.numOfInfants > 0 && `, ${searchParams.numOfInfants} infants`}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Budget: ≤₪{searchParams.maxPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.deals.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🤷‍♂️</div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Deals Found</h3>
          <p className="text-yellow-700">
            No hotels match your criteria. Try:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-700 text-sm space-y-1">
            <li>Increasing your budget</li>
            <li>Selecting different dates</li>
            <li>Choosing "All Cities"</li>
            <li>Reducing the number of guests</li>
          </ul>
        </div>
      ) : (
        <>
          {/* Great Deals Section */}
          {results.greatDeals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                🎉 Great Deals (Under ₪{searchParams.maxPrice?.toLocaleString()})
              </h3>
              <div className="grid gap-4">
                {results.greatDeals.map((deal, index) => (
                  <DealCard 
                    key={`great-${index}`} 
                    deal={deal} 
                    isGreatDeal={true}
                    searchParams={searchParams}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Deals Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💰 All Available Deals
            </h3>
            <div className="grid gap-4">
              {results.deals.map((deal, index) => (
                <DealCard 
                  key={`all-${index}`} 
                  deal={deal}
                  isGreatDeal={deal.numericPrice < (searchParams.maxPrice || 2000)}
                  searchParams={searchParams}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Summary Stats */}
      {results.deals.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Search Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900">{results.totalHotelsChecked}</div>
              <div className="text-gray-500">Hotels Checked</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{results.deals.length}</div>
              <div className="text-gray-500">Deals Found</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">₪{Math.min(...results.deals.map(d => d.numericPrice)).toLocaleString()}</div>
              <div className="text-gray-500">Lowest Price</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">₪{Math.round(results.deals.reduce((sum, d) => sum + d.numericPrice, 0) / results.deals.length).toLocaleString()}</div>
              <div className="text-gray-500">Average Price</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;