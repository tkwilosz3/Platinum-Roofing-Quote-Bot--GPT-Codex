'use client';

import { useState } from 'react';
import { DamageFlag, MeasureResponse, QuoteRequest } from '@/types';

interface QuestionsStepProps {
  measurement: MeasureResponse;
  onQuoted: (request: QuoteRequest, response: any) => void;
}

const materialOptions = [
  { value: 'shingle', label: 'Asphalt shingle' },
  { value: 'tile', label: 'Tile' },
  { value: 'metal', label: 'Metal' },
  { value: 'flat', label: 'Flat / foam' },
  { value: 'not_sure', label: "Not sure" },
];

const storyOptions = [
  { value: 'one', label: '1 story' },
  { value: 'two_plus', label: '2 or more stories' },
  { value: 'attached', label: 'Townhome / duplex / attached' },
];

const ageOptions = [
  '0-5',
  '6-10',
  '11-15',
  '16-20',
  '20+',
  'not_sure',
];

const reasonOptions = [
  { value: 'replacement', label: 'I know I need a full replacement' },
  { value: 'leak_damage', label: 'I have a leak or visible damage' },
  { value: 'planning', label: 'Just planning ahead / curious' },
];

const complexityOptions = [
  { value: 'simple', label: 'Simple roof' },
  { value: 'average', label: 'Average roof' },
  { value: 'complex', label: 'Complex roof' },
];

const damageOptions: { value: DamageFlag; label: string }[] = [
  { value: 'active_leak', label: 'Active leak' },
  { value: 'missing_material', label: 'Missing or broken material' },
  { value: 'sagging_soft_spots', label: 'Sagging or soft spots' },
  { value: 'recent_storm', label: 'Recent storm impact' },
  { value: 'none', label: 'None of these' },
];

export function QuestionsStep({ measurement, onQuoted }: QuestionsStepProps) {
  const [material, setMaterial] = useState<QuoteRequest['material'] | 'not_sure'>('shingle');
  const [stories, setStories] = useState<QuoteRequest['stories']>('one');
  const [complexity, setComplexity] = useState<QuoteRequest['complexity']>('average');
  const [roofAgeBucket, setRoofAgeBucket] = useState<QuoteRequest['roof_age_bucket']>('6-10');
  const [reason, setReason] = useState<QuoteRequest['reason']>('planning');
  const [damageFlags, setDamageFlags] = useState<DamageFlag[]>(['none']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDamageFlag = (value: DamageFlag) => {
    if (value === 'none') {
      setDamageFlags(['none']);
      return;
    }
    const filtered = damageFlags.filter((flag) => flag !== 'none');
    if (filtered.includes(value)) {
      setDamageFlags(filtered.filter((f) => f !== value));
    } else {
      setDamageFlags([...filtered, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const request: QuoteRequest = {
        area_squares: measurement.area_squares || 0,
        material: material === 'not_sure' ? 'shingle' : material,
        stories,
        complexity,
        roof_age_bucket: roofAgeBucket,
        reason,
        damage_flags: damageFlags,
        material_display: material,
      };
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Unable to calculate quote.');
        return;
      }
      onQuoted(request, data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Step 2</p>
        <h2 className="text-2xl font-bold text-slate-900">Tell us a bit about your roof</h2>
        <p className="text-slate-600">We use these answers to refine your estimate.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Material</h3>
            <div className="grid grid-cols-2 gap-2">
              {materialOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMaterial(opt.value as QuoteRequest['material'] | 'not_sure')}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    material === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                  {opt.value === 'not_sure' && <p className="text-xs text-slate-500">We will assume shingle for now.</p>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Stories</h3>
            <div className="grid grid-cols-1 gap-2">
              {storyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStories(opt.value as QuoteRequest['stories'])}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    stories === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Roof age</h3>
            <div className="grid grid-cols-2 gap-2">
              {ageOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRoofAgeBucket(opt as QuoteRequest['roof_age_bucket'])}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    roofAgeBucket === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.replace('-', '–')}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Why are you here?</h3>
            <div className="grid grid-cols-1 gap-2">
              {reasonOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setReason(opt.value as QuoteRequest['reason'])}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    reason === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Roof complexity</h3>
            <div className="grid grid-cols-3 gap-2">
              {complexityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setComplexity(opt.value as QuoteRequest['complexity'])}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    complexity === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Any damage?</h3>
            <div className="grid grid-cols-2 gap-2">
              {damageOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleDamageFlag(opt.value)}
                  className={`border rounded-lg px-3 py-3 text-left transition ${
                    damageFlags.includes(opt.value) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">Measured size: {measurement.area_squares?.toFixed(1)} squares</div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 text-white px-6 py-3 font-semibold shadow hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'See my estimate'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
