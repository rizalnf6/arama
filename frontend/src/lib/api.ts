// API Client for Villa Arama Riverside Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Types
export interface Property {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  image_url: string;
  images: string[];
  amenities: string[];
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  daily_price: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BedroomConfig {
  id: string;
  name: string;
  description: string;
  price_add: number;
  max_guests: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyPricing {
  property_id: string;
  date: string;
  season_name: string;
  season_daily_price: number;
  bedroom_config_id: string;
  bedroom_name: string;
  bedroom_price_add: number;
  total_price: number;
}

export interface PricingResponse {
  property_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  breakdown: PropertyPricing[];
}

export interface Enquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  bedroom_config_id: string;
  message: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ICalURL {
  id: string;
  property_id: string;
  url: string;
  source: string;
  last_sync: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// API Functions
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Properties
export async function getProperties(): Promise<Property[]> {
  return fetchApi<Property[]>('/properties');
}

export async function getProperty(id: string): Promise<Property> {
  return fetchApi<Property>(`/properties/${id}`);
}

export async function getPropertyPricing(
  propertyId: string,
  checkIn?: string,
  checkOut?: string,
  bedroomConfigId?: string
): Promise<PricingResponse | PropertyPricing> {
  const params = new URLSearchParams();
  if (checkIn) params.append('check_in', checkIn);
  if (checkOut) params.append('check_out', checkOut);
  if (bedroomConfigId) params.append('bedroom_config_id', bedroomConfigId);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchApi(`/properties/${propertyId}/pricing${query}`);
}

export async function getPropertyAvailability(propertyId: string): Promise<{ property_id: string; blocked_dates: string[] }> {
  return fetchApi(`/properties/${propertyId}/availability`);
}

// Enquiries
export async function createEnquiry(data: {
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  bedroom_config_id?: string;
  message?: string;
}): Promise<Enquiry> {
  return fetchApi<Enquiry>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin - Seasons
export async function getSeasons(): Promise<Season[]> {
  return fetchApi<Season[]>('/admin/seasons');
}

export async function createSeason(data: Omit<Season, 'id' | 'created_at' | 'updated_at'>): Promise<Season> {
  return fetchApi<Season>('/admin/seasons', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSeason(id: string, data: Partial<Season>): Promise<Season> {
  return fetchApi<Season>(`/admin/seasons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSeason(id: string): Promise<void> {
  return fetchApi(`/admin/seasons/${id}`, { method: 'DELETE' });
}

// Admin - Bedroom Configs
export async function getBedroomConfigs(): Promise<BedroomConfig[]> {
  return fetchApi<BedroomConfig[]>('/admin/bedroom-configs');
}

export async function createBedroomConfig(data: Omit<BedroomConfig, 'id' | 'created_at' | 'updated_at'>): Promise<BedroomConfig> {
  return fetchApi<BedroomConfig>('/admin/bedroom-configs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBedroomConfig(id: string, data: Partial<BedroomConfig>): Promise<BedroomConfig> {
  return fetchApi<BedroomConfig>(`/admin/bedroom-configs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBedroomConfig(id: string): Promise<void> {
  return fetchApi(`/admin/bedroom-configs/${id}`, { method: 'DELETE' });
}

// Admin - Enquiries
export async function getEnquiries(): Promise<Enquiry[]> {
  return fetchApi<Enquiry[]>('/admin/enquiries');
}

export async function updateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
  return fetchApi<Enquiry>(`/admin/enquiries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function exportEnquiries(): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/admin/enquiries/export`);
  return response.blob();
}

// Admin - iCal
export async function getICalURLs(): Promise<ICalURL[]> {
  return fetchApi<ICalURL[]>('/admin/ical');
}

export async function addICalURL(data: { property_id: string; url: string; source: string }): Promise<ICalURL> {
  return fetchApi<ICalURL>('/admin/ical', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteICalURL(id: string): Promise<void> {
  return fetchApi(`/admin/ical/${id}`, { method: 'DELETE' });
}

export async function syncICalFeeds(): Promise<{ message: string; count: number }> {
  return fetchApi('/admin/ical/sync', { method: 'POST' });
}
