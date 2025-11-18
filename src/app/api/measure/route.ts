import { NextResponse } from 'next/server';
import { MeasureResponse } from '@/types';

const randomFromAddress = (address: string) => {
  let hash = 0;
  for (let i = 0; i < address.length; i += 1) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const base = Math.abs(hash % 18) + 18; // 18-35 range
  return base + (hash % 5);
};

const parseAddress = (address: string) => {
  const parts = address.split(',').map((p) => p.trim());
  const [street, city, stateZip] = parts;
  const state = stateZip?.split(' ')[0]?.toUpperCase() || undefined;
  const zip = stateZip?.split(' ')[1] || undefined;
  return { street, city, state, zip };
};

export async function POST(request: Request) {
  const { address } = await request.json();
  if (!address || typeof address !== 'string') {
    return NextResponse.json<MeasureResponse>({ success: false, error: 'Address is required.' }, { status: 400 });
  }

  const { city, state, zip } = parseAddress(address);
  const areaSquares = randomFromAddress(address);
  const areaSqft = areaSquares * 100;

  const response: MeasureResponse = {
    success: true,
    address_normalized: address,
    city: city || 'Phoenix',
    state: state || 'AZ',
    zip: zip || '85001',
    area_squares: areaSquares,
    area_sqft: areaSqft,
  };

  return NextResponse.json(response);
}
