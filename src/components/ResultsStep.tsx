import { ContactForm } from './ContactForm';
import { NarratorPanel } from './NarratorPanel';
import { pricingConfig } from '@/lib/config/pricing';
import { MeasureResponse, QuoteRequest, QuoteResponse } from '@/types';

interface ResultsStepProps {
  measurement: MeasureResponse;
  request: QuoteRequest;
  quote: QuoteResponse;
  onLeadSubmitted: () => void;
}

export function ResultsStep({ measurement, request, quote, onLeadSubmitted }: ResultsStepProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-xl p-8">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-indigo-700">
          {measurement.city && <span className="px-3 py-1 bg-indigo-50 rounded-full">{measurement.city}</span>}
          <span className="px-3 py-1 bg-indigo-50 rounded-full">
            {request.material_display ? pricingConfig.materials[request.material_display]?.label ?? request.material_display : pricingConfig.materials[request.material].label}
          </span>
          <span className="px-3 py-1 bg-indigo-50 rounded-full">{pricingConfig.stories[request.stories].label}</span>
          <span className="px-3 py-1 bg-indigo-50 rounded-full">Age: {request.roof_age_bucket}</span>
          <span className="px-3 py-1 bg-indigo-50 rounded-full">{pricingConfig.complexity[request.complexity].label}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Your ballpark estimate</h2>
        <p className="text-slate-600 mb-4">Based on roof size, material, and your answers.</p>
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 space-y-6">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <p className="text-sm font-semibold text-slate-700">Estimated full replacement</p>
              <p className="text-3xl font-bold text-slate-900">
                ${quote.replacement_low.toLocaleString()} – ${quote.replacement_high.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Includes material, labor, tear-off, and average waste factor.</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-700">Major repair ballpark</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${quote.repair_low.toLocaleString()} – ${quote.repair_high.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Based on similar projects. Exact pricing follows inspection.</p>
            </div>
            <p className="text-sm text-slate-600">
              This is a ballpark based on roof size, material, and your answers. A project manager can confirm exact
              pricing after a brief inspection or drone scan.
            </p>
          </div>
          <NarratorPanel request={request} response={quote} city={measurement.city} />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-8" id="calendar">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="md:w-1/2 space-y-2">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Step 3</p>
            <h3 className="text-2xl font-bold text-slate-900">Pick a time for your roof inspection</h3>
            <p className="text-slate-600">Choose a time and share the best way to reach you.</p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <iframe
                src={process.env.GHL_CALENDAR_IFRAME_URL}
                title="GHL Calendar"
                className="w-full h-[450px]"
                allowFullScreen
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Contact info</h4>
              <ContactForm
                measurementAddress={{
                  address: measurement.address_normalized || '',
                  city: measurement.city,
                  state: measurement.state,
                  zip: measurement.zip,
                }}
                request={request}
                quote={quote}
                onSuccess={onLeadSubmitted}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
