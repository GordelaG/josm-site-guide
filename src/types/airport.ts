export type AirportStatus = 'done' | 'in_progress' | 'pending';

export interface AirportUpdate {
  version: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  imageUrl?: string; // Legado / Foto Principal (Depois)
  beforeImageUrl?: string; // Foto Antes (Layout Anterior)
  afterImageUrl?: string; // Foto Depois (Novo Layout EuroScope)
}

export interface Airport {
  icao: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  status: AirportStatus;
  version?: string;
  lastUpdateTitle?: string;
  lastUpdateDescription?: string;
  lastUpdateImageUrl?: string;
  lastUpdateBeforeImageUrl?: string;
  updatesHistory?: AirportUpdate[];
  updatedAt?: string;
  updatedBy?: string;
  notes?: string;
  assignedTo?: string;
}

export interface AirportCounts {
  done: number;
  in_progress: number;
  pending: number;
  total: number;
}
