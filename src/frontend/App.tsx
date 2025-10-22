import React from 'react';
import HotelSearchForm from './components/HotelSearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import { useHotelSearch } from './hooks/useHotelSearch';
import './index.css';

const App: React.FC = () => {
  const {
    searchParams,
    setSearchParams,
    results,
    isLoading,
    error,
    searchHotels,
    reset
  } = useHotelSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
              {/* Title */}
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Next Vacay
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  ✨ Discover amazing Israeli hotel deals
                </p>
              </div>
            </div>
            
            {/* New Search Button */}
            {results && results.deals && results.deals.length > 0 && (
              <button
                onClick={reset}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                <span className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>New Search</span>
                </span>
              </button>
            )}
          </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!results ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              {/* Floating Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-sm font-medium text-blue-800 shadow-sm">
                <span className="animate-pulse mr-2">✨</span>
                Best Family Deals in Israel
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight">
                  Find Your Perfect
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                    Dream Vacation
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Search across premium Israeli hotels for exclusive family-friendly deals. 
                  Half-board included, memories guaranteed! 
                  <span className="inline-block animate-bounce ml-2">🍽️</span>
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Premium Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Live Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Best Price</div>
                </div>
              </div>
            </div>
            
            {/* Search Form */}
            <div className="relative">
              <HotelSearchForm
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onSearch={searchHotels}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Found Your Perfect Deals!
              </h2>
              <p className="text-gray-600">
                Here are the best matches for your dream vacation
              </p>
            </div>
            
            {/* Results */}
            <ResultsDisplay
              results={results}
              isLoading={isLoading}
              error={error}
              searchParams={searchParams}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                🏖️
              </div>
              <h3 className="text-2xl font-bold">My Next Vacay</h3>
            </div>
            
            <p className="text-gray-300 max-w-2xl mx-auto">
              Making your vacation dreams come true, one perfect deal at a time. 
              Experience the beauty of Israel with unbeatable family packages.
            </p>
            
            <div className="flex justify-center space-x-6">
              <span className="text-sm text-gray-400">✨ Premium Hotels</span>
              <span className="text-sm text-gray-400">🍽️ Half-Board Included</span>
              <span className="text-sm text-gray-400">👨‍👩‍👧‍👦 Family Friendly</span>
            </div>
            
            <div className="pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                © 2024 My Next Vacay - Your gateway to unforgettable experiences
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;