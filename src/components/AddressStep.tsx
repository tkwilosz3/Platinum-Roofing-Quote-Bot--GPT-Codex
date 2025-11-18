'use client';

import { useState } from 'react';
import { MeasureResponse } from '@/types';

interface AddressStepProps {
  onMeasured: (result: MeasureResponse) => void;
}

export function AddressStep({ onMeasured }: AddressStepProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outOfArea, setOutOfArea] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOutOfArea(false);
    setLoading(true);
    try {
      const res = await fetch('/api/measure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = (await res.json()) as MeasureResponse;
      if (!data.success) {
        setError(data.error ?? 'Unable to process that address.');
        return;
      }
      if (data.state && data.state !== 'AZ') {
        setOutOfArea(true);
        return;
      }
      onMeasured(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-8">
      <div className="space-y-2 mb-6 text-center">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Fast roof ballpark</p>
        <h1 className="text-3xl font-bold text-slate-900">Get a ballpark roof replacement estimate for your home in Arizona.</h1>
        <p className="text-slate-600">Enter your property address to start. No commitment and no spam.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Property address</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 shadow-inner focus:border-indigo-500 focus:outline-none"
            placeholder="123 Main St, Phoenix, AZ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold shadow hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'Checking roof size…' : 'Check my roof and see my estimate'}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {outOfArea && (
        <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          We currently provide ballpark estimates for Arizona addresses. Please contact us directly for other areas.
        </p>
      )}
    </div>
  );
}
