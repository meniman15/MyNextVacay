import React from 'react';
import { Calendar, Users, MapPin, Search } from 'lucide-react';
import { SearchParams } from '../../shared/types';
import { fattal } from '../../shared/constants/hotelIds';

interface HotelSearchFormProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  searchParams,
  setSearchParams,
  onSearch,
  isLoading
}) => {
  const cities = Object.keys(fattal.hotelsByCity);

  const handleInputChange = (field: keyof SearchParams, value: any) => {
    setSearchParams({
      ...searchParams,
      [field]: value
    });
  };

  const getNextFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday.toISOString().split('T')[0];
  };

  const getNextSaturday = () => {
    const nextFriday = new Date(getNextFriday());
    nextFriday.setDate(nextFriday.getDate() + 1);
    return nextFriday.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (!searchParams.checkIn) {
      setSearchParams({
        ...searchParams,
        checkIn: getNextFriday(),
        checkOut: getNextSaturday()
      });
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Find Your Perfect Half-Board Deal
        </h2>
        <p className="text-gray-600">
          Search across Israeli hotels for the best family-friendly deals under your budget
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="space-y-6">
        {/* Hotel Chain Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Chain
          </label>
          <select
            value={searchParams.hotelChain}
            onChange={(e) => handleInputChange('hotelChain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fattal">Leonardo Hotels (Fattal)</option>
            <option value="dan" disabled>Dan Hotels (Coming Soon)</option>
          </select>
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Destination
          </label>
          <select
            value={searchParams.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Check-in
            </label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out
            </label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={searchParams.checkIn}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Guests
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Adults</label>
              <select
                value={searchParams.numOfAdults}
                onChange={(e) => handleInputChange('numOfAdults', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Children</label>
              <select
                value={searchParams.numOfChildren}
                onChange={(e) => handleInputChange('numOfChildren', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Infants</label>
              <select
                value={searchParams.numOfInfants}
                onChange={(e) => handleInputChange('numOfInfants', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[0, 1, 2].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Budget (ILS)
          </label>
          <input
            type="number"
            value={searchParams.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
            min="500"
            max="10000"
            step="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only show deals under this price
          </p>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching Hotels...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Find Deals
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default HotelSearchForm;