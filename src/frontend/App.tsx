import React from 'react';
import HotelSearchForm from './components/HotelSearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import { useHotelSearch } from './hooks/useHotelSearch';
import './App.css';
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              🏖️ My Next Vacay
            </h1>
            {results && results.deals && results.deals.length > 0 && (
              <button
                onClick={reset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                New Search
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          <HotelSearchForm
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={searchHotels}
            isLoading={isLoading}
          />
        ) : (
          <ResultsDisplay
            results={results}
            isLoading={isLoading}
            error={error}
            searchParams={searchParams}
          />
        )}
      </main>
    </div>
  );
};

export { App as default };

// import TestUI from './TestUI';
// import './index.css';

// const App: React.FC = () => {
//   return (
//     <div>
//       <TestUI /> {/* Add this to test */}
//       {/* Your existing content */}
//     </div>
//   );
// };

// export { App as default };