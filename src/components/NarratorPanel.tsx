import { QuoteRequest, QuoteResponse } from '@/types';
import { getComplexityLabel, getMaterialLabel, getStoryLabel } from '@/lib/config/pricing';

interface NarratorPanelProps {
  request: QuoteRequest;
  response: QuoteResponse;
  city?: string;
}

const riskTone: Record<QuoteResponse['risk_level'], string> = {
  normal: 'steady',
  elevated: 'attentive',
  urgent: 'urgent',
};

export function NarratorPanel({ request, response, city }: NarratorPanelProps) {
  const materialLabel = getMaterialLabel(request.material_display ?? request.material);
  const storyLabel = getStoryLabel(request.stories);
  const complexityLabel = getComplexityLabel(request.complexity);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Narrator</h3>
        <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-white/10">{riskTone[response.risk_level]}</span>
      </div>
      <p className="text-slate-200 text-sm">
        For a {storyLabel.toLowerCase()} {materialLabel.toLowerCase()} roof in {city ?? 'your area'}, this range
        reflects typical labor and material costs for a full replacement. Complexity is marked as {complexityLabel.toLowerCase()} and includes waste and tear-off.
      </p>
      <p className="text-slate-200 text-sm">
        {response.ai_summary}
      </p>
      <p className="text-slate-200 text-sm">
        Major repairs often cost {Math.round(response.repair_low / 100) * 100}–{Math.round(response.repair_high / 100) * 100} based on scope.
        An inspection or drone scan confirms exact measurements and scope before scheduling.
      </p>
    </div>
  );
}
