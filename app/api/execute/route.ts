import { NextResponse } from 'next/server';
import { convertToStructuredQuery } from '@/lib/openrouter';
import { searchRestaurants } from '@/lib/foursquare';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      );
    }

    const structuredQuery = await convertToStructuredQuery(message);

    const searchResults = await searchRestaurants(structuredQuery.parameters);

    return NextResponse.json({ 
      query: structuredQuery,
      results: searchResults.results
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
