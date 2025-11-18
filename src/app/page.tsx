'use client';

import { useState } from 'react';
import { AddressStep } from '@/components/AddressStep';
import { QuestionsStep } from '@/components/QuestionsStep';
import { ResultsStep } from '@/components/ResultsStep';
import { MeasureResponse, QuoteRequest, QuoteResponse } from '@/types';

export default function Home() {
  const [step, setStep] = useState<'address' | 'questions' | 'results' | 'done'>('address');
  const [measurement, setMeasurement] = useState<MeasureResponse | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);

  const handleMeasured = (result: MeasureResponse) => {
    setMeasurement(result);
    setStep('questions');
  };

  const handleQuoted = (request: QuoteRequest, response: QuoteResponse) => {
    setQuoteRequest(request);
    setQuoteResponse(response);
    setStep('results');
  };

  const handleLeadSubmitted = () => setStep('done');

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-700 font-semibold">{`Platinum Roofing Group LLC`}</p>
          <h1 className="text-xl font-bold text-slate-900">AI Roof Quote Bot</h1>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Service area</p>
          <p>Arizona residential roofs</p>
        </div>
      </header>

      {step === 'address' && <AddressStep onMeasured={handleMeasured} />}

      {step === 'questions' && measurement && (
        <QuestionsStep measurement={measurement} onQuoted={handleQuoted} />
      )}

      {step === 'results' && measurement && quoteRequest && quoteResponse && (
        <ResultsStep
          measurement={measurement}
          request={quoteRequest}
          quote={quoteResponse}
          onLeadSubmitted={handleLeadSubmitted}
        />
      )}

      {step === 'done' && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">Thank you!</h2>
          <p className="text-slate-600">
            We received your info and a project manager will reach out to confirm the inspection time. You will also
            get a confirmation email shortly.
          </p>
        </div>
      )}
    </main>
  );
}
