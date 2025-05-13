"use client"

import { useState } from 'react';
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [structuredQuery, setStructuredQuery] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setStructuredQuery(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get restaurant data');
      }

      const data = await response.json();
      setResults(data.results);
      setStructuredQuery(data.query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return 'Unknown distance';
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getStatusText = (status?: string) => {
    if (!status) return 'Status unknown';
    
    switch (status) {
      case 'LikelyOpen':
      case 'VeryLikelyOpen':
        return 'Likely Open';
      case 'Unsure':
        return 'Status unknown';
      default:
        return status;
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Restaurant Finder</h1>
        <ThemeToggle />
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="text-center p-10 text-gray-500">
          Enter a query like "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
        </div>
      )}

      <div className="grid gap-6">
        {results.map((restaurant) => (
          <div key={restaurant.fsq_id} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
              {restaurant.chains && restaurant.chains.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Chain: {restaurant.chains[0].name}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-3">{restaurant.location.formatted_address}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.categories.map((category: any, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {category.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {formatDistance(restaurant.distance)}
              </span>
              
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {getStatusText(restaurant.closed_bucket)}
              </span>
              {restaurant.location.cross_street && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Near: {restaurant.location.cross_street}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
