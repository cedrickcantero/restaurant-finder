import type { LLMResponse, Restaurant } from "@/lib/types"

const FOURSQUARE_API_KEY = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places/search';

export interface FoursquareResponseType {
  results: any[];
  context: any;
}

export async function searchFoursquare(llmResponse: LLMResponse): Promise<Restaurant[]> {
  console.log("Searching Foursquare with parameters:", llmResponse.parameters)

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const url = buildFoursquareUrl(llmResponse.parameters)
  const response = await fetch(url, {
    headers: {
      'Authorization': process.env.FOURSQUARE_API_KEY || ''
    }
  })

  const data: FoursquareResponseType = await response.json()
  return transformFoursquareResults(data.results)
}

function buildFoursquareUrl(parameters: LLMResponse["parameters"]): string {
  const baseUrl = "https://api.foursquare.com/v3/places/search"

  const queryParams = new URLSearchParams()

  if (parameters.query) {
    queryParams.append("query", parameters.query)
  }

  if (parameters.near) {
    queryParams.append("near", parameters.near)
  }

  if (parameters.price) {
    queryParams.append("price", parameters.price)
  }

  if (parameters.open_now) {
    queryParams.append("open_now", "true")
  }

  queryParams.append("sort", "RATING")
  queryParams.append("limit", "10")

  return `${baseUrl}?${queryParams.toString()}`
}

function transformFoursquareResults(results: any[]): Restaurant[] {
  return results.map((result) => {
    const cuisine = result.categories ? result.categories.map((cat: any) => cat.name).join(", ") : "Restaurant"

    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.formatted_address,
      cuisine: cuisine,
      rating: result.rating || 0,
      price: result.price || 0,
      hours: result.hours?.display || "Hours not available",
      distance: Math.round((result.distance / 1609.34) * 10) / 10,
      imageUrl:
        result.photos && result.photos.length > 0
          ? `${result.photos[0].prefix}original${result.photos[0].suffix}`
          : "/placeholder.svg?height=100&width=200",
    }
  })
}

export interface SearchParameters {
  query: string;
  near: string;
  price?: number;
  open_now?: boolean;
}

export async function searchRestaurants(params: SearchParameters): Promise<any> {
  if (!FOURSQUARE_API_KEY) {
    throw new Error('Foursquare API key is not configured');
  }

  const queryParams = new URLSearchParams({
    query: params.query,
    near: params.near,
    categories: '13065', // Food category
    sort: 'RATING',
    limit: '10'
  });

  if (params.price) {
    queryParams.append('price', params.price.toString());
  }

  if (params.open_now) {
    queryParams.append('open_now', 'true');
  }

  const response = await fetch(`${FOURSQUARE_API_URL}?${queryParams.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': FOURSQUARE_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from Foursquare');
  }

  return response.json();
}
