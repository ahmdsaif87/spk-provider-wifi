import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.bobotPreset.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const preset = await prisma.bobotPreset.create({
    data: {
      nama: body.nama,
      bobot: JSON.stringify(body.bobot),
    },
  });
  return NextResponse.json(preset);
}
