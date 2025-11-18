'use client';

import { useState } from 'react';
import { LeadPayload, QuoteRequest, QuoteResponse } from '@/types';

interface ContactFormProps {
  measurementAddress: { address: string; city?: string; state?: string; zip?: string };
  request: QuoteRequest;
  quote: QuoteResponse;
  onSuccess: () => void;
}

const preferredOptions = [
  { value: 'call', label: 'Call' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
];

const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2_weeks', label: '1-2 weeks' },
  { value: 'researching', label: 'Just researching' },
];

const insuranceOptions = [
  { value: 'cash', label: 'Cash / self-pay' },
  { value: 'insurance', label: 'Insurance claim' },
  { value: 'unsure', label: 'Not sure yet' },
];

export function ContactForm({ measurementAddress, request, quote, onSuccess }: ContactFormProps) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    preferred_contact_method: 'call',
    timeline: 'asap',
    insurance_intent: 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload: LeadPayload = {
      contact: {
        first_name: form.first_name,
        last_name: form.last_name || undefined,
        email: form.email,
        phone: form.phone,
      },
      property: {
        address: measurementAddress.address,
        city: measurementAddress.city ?? '',
        state: measurementAddress.state ?? '',
        zip: measurementAddress.zip ?? '',
      },
      roof: {
        material: request.material_display ?? request.material,
        stories: request.stories,
        age_bucket: request.roof_age_bucket,
        complexity: request.complexity,
        reason: request.reason,
        damage_flags: request.damage_flags,
      },
      quote,
      meta: {
        source: 'ai_roofing_quote_bot',
        funnel: 'platinum_roofing',
        stage: 'New AI Quote Lead',
      },
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Unable to send lead.');
        return;
      }
      onSuccess();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm font-medium text-slate-700">
          First name*
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Last name
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
          />
        </label>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm font-medium text-slate-700">
          Email*
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Phone*
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </label>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm font-medium text-slate-700">
          Preferred contact
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.preferred_contact_method}
            onChange={(e) => handleChange('preferred_contact_method', e.target.value)}
          >
            {preferredOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Timeline
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.timeline}
            onChange={(e) => handleChange('timeline', e.target.value)}
          >
            {timelineOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Payment / insurance
          <select
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            value={form.insurance_intent}
            onChange={(e) => handleChange('insurance_intent', e.target.value)}
          >
            {insuranceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold shadow hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Submit and confirm'}
      </button>
    </form>
  );
}
