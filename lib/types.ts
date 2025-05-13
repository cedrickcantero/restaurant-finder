// Types for the application

// Restaurant type
export type Restaurant = {
  id: string
  name: string
  address: string
  cuisine: string
  rating: number
  price: number
  hours: string
  distance: number
  imageUrl?: string
}

// LLM response type
export type LLMResponse = {
  action: string
  parameters: {
    query?: string
    near?: string
    price?: string
    open_now?: boolean
    min_rating?: number
    cuisine?: string
    [key: string]: any
  }
}

// Foursquare API response type (simplified)
export type FoursquareResponse = {
  results: FoursquareResult[]
  context?: any
}

export type FoursquareResult = {
  fsq_id: string
  name: string
  location: {
    address: string
    formatted_address: string
    locality: string
    region: string
    postcode: string
    country: string
  }
  categories: {
    id: number
    name: string
    short_name: string
  }[]
  distance: number
  geocodes: {
    main: {
      latitude: number
      longitude: number
    }
  }
  hours?: {
    display: string
    is_open: boolean
  }
  rating?: number
  price?: number
  photos?: {
    id: string
    created_at: string
    prefix: string
    suffix: string
    width: number
    height: number
  }[]
}
