import { NextResponse } from 'next/server';
import { LeadPayload } from '@/types';

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  if (!payload.contact?.first_name || !payload.contact?.email || !payload.contact?.phone) {
    return NextResponse.json({ success: false, error: 'Missing contact info.' }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('Lead payload (webhook not configured):', payload);
    return NextResponse.json({ success: true });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ success: false, error: errorText || 'Webhook failed.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send lead', error);
    return NextResponse.json({ success: false, error: 'Failed to send lead.' }, { status: 500 });
  }
}
