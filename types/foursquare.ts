export interface FoursquareResponse {
  results: FoursquareResult[];
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}

export interface FoursquareResult {
  fsq_id: string;
  name: string;
  location: {
    address: string;
    locality: string;
    region: string;
    postcode: string;
    country: string;
    formatted_address: string;
    cross_street?: string;
  };
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }[];
  chains?: {
    id: string;
    name: string;
  }[];
  distance?: number;
  closed_bucket?: string;
  geocodes?: {
    main: {
      latitude: number;
      longitude: number;
    };
    roof?: {
      latitude: number;
      longitude: number;
    };
  };
  timezone?: string;
  related_places?: any;
} 