export interface MeasureResponse {
  success: boolean;
  error?: string;
  address_normalized?: string;
  city?: string;
  state?: string;
  zip?: string;
  area_sqft?: number;
  area_squares?: number;
}

export type DamageFlag =
  | 'active_leak'
  | 'missing_material'
  | 'sagging_soft_spots'
  | 'recent_storm'
  | 'none';

export interface QuoteRequest {
  area_squares: number;
  material: 'shingle' | 'tile' | 'metal' | 'flat';
  stories: 'one' | 'two_plus' | 'attached';
  complexity: 'simple' | 'average' | 'complex';
  roof_age_bucket: '0-5' | '6-10' | '11-15' | '16-20' | '20+' | 'not_sure';
  reason: 'replacement' | 'leak_damage' | 'planning';
  damage_flags: DamageFlag[];
  material_display?: 'shingle' | 'tile' | 'metal' | 'flat' | 'not_sure';
}

export type RiskLevel = 'normal' | 'elevated' | 'urgent';

export interface QuoteResponse {
  replacement_low: number;
  replacement_high: number;
  repair_low: number;
  repair_high: number;
  risk_level: RiskLevel;
  ai_summary: string;
}

export interface LeadPayload {
  contact: {
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
  };
  property: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  roof: {
    material: 'shingle' | 'tile' | 'metal' | 'flat' | 'not_sure';
    stories: 'one' | 'two_plus' | 'attached';
    age_bucket: string;
    complexity: 'simple' | 'average' | 'complex';
    reason: 'replacement' | 'leak_damage' | 'planning';
    damage_flags: DamageFlag[];
  };
  quote: QuoteResponse;
  meta: {
    source: 'ai_roofing_quote_bot';
    funnel: 'platinum_roofing';
    stage: 'New AI Quote Lead';
  };
}

export interface PricingConfig {
  business: {
    name: string;
    service_area_label: string;
    currency: string;
  };
  materials: {
    [key: string]: { label: string; base_per_square: number };
  };
  stories: {
    [key: string]: { label: string; multiplier: number };
  };
  complexity: {
    [key: string]: { label: string; multiplier: number };
  };
  tearoff_per_square: number;
  waste_factor: number;
  min_job_total: number;
  range_buffer_percent: number;
  repair_ratio: {
    min: number;
    max: number;
  };
}
