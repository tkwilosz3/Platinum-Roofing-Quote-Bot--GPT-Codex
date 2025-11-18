import { NextResponse } from 'next/server';
import { pricingConfig } from '@/lib/config/pricing';
import { DamageFlag, PricingConfig, QuoteRequest, QuoteResponse, RiskLevel } from '@/types';

const classifyRisk = (request: QuoteRequest): RiskLevel => {
  const { roof_age_bucket: age, damage_flags, reason } = request;
  const hasFlag = (flag: DamageFlag) => damage_flags.includes(flag);
  const hasDamage = damage_flags.some((f) => f !== 'none');

  if (
    (age === '20+' && (hasFlag('active_leak') || hasFlag('sagging_soft_spots') || hasFlag('missing_material')))
    || (reason === 'leak_damage' && hasDamage)
    || (hasFlag('recent_storm') && ['11-15', '16-20', '20+'].includes(age))
  ) {
    return 'urgent';
  }

  if (
    age === '16-20'
    || (age === '11-15' && reason === 'leak_damage' && !hasFlag('active_leak') && !hasFlag('sagging_soft_spots'))
    || (hasFlag('missing_material') && !hasFlag('active_leak') && !hasFlag('sagging_soft_spots'))
  ) {
    return 'elevated';
  }

  return 'normal';
};

const buildSummary = (
  request: QuoteRequest,
  response: QuoteResponse,
  config: PricingConfig,
  city?: string,
) => {
  const materialLabel = config.materials[request.material]?.label ?? request.material;
  const storyLabel = config.stories[request.stories]?.label ?? request.stories;

  if (response.risk_level === 'urgent') {
    return `Based on the age and damage you reported, there is higher risk of ongoing issues. The range above is typical for ${materialLabel.toLowerCase()} replacements in ${city ?? 'your area'}. Scheduling an inspection soon helps avoid additional interior repairs.`;
  }
  if (response.risk_level === 'elevated') {
    return `Your ${storyLabel.toLowerCase()} ${materialLabel.toLowerCase()} roof is moving into the later part of its lifespan. The estimate reflects what similar projects run in ${city ?? 'your area'}. Planning an inspection now will confirm timing and scope.`;
  }
  return `For a ${storyLabel.toLowerCase()} ${materialLabel.toLowerCase()} roof in ${city ?? 'your area'}, this range reflects typical material and labor costs. Your answers suggest you have some time to plan, and an inspection will pin down an exact number.`;
};

export async function POST(request: Request) {
  const body = (await request.json()) as QuoteRequest;
  const config = pricingConfig;

  const { area_squares, material, stories, complexity } = body;
  if (!area_squares || !material || !stories || !complexity) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const effectiveSquares = area_squares * config.waste_factor;
  const materialRate = config.materials[material].base_per_square;
  const storyFactor = config.stories[stories].multiplier;
  const complexityFactor = config.complexity[complexity].multiplier;

  const base = effectiveSquares * materialRate * storyFactor * complexityFactor;
  const tearoff = effectiveSquares * config.tearoff_per_square;
  let center = base + tearoff;
  if (center < config.min_job_total) center = config.min_job_total;

  const buffer = config.range_buffer_percent;
  const replacement_low = Math.round(center * (1 - buffer));
  const replacement_high = Math.round(center * (1 + buffer));

  const repair_low = Math.round(replacement_low * config.repair_ratio.min);
  const repair_high = Math.round(replacement_high * config.repair_ratio.max);

  const risk_level = classifyRisk(body);
  const ai_summary = buildSummary(body, { replacement_low, replacement_high, repair_low, repair_high, risk_level, ai_summary: '' }, config);

  const response: QuoteResponse = {
    replacement_low,
    replacement_high,
    repair_low,
    repair_high,
    risk_level,
    ai_summary,
  };

  return NextResponse.json(response);
}
