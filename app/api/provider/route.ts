import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      select: {
        nama: true,
        tarif: true,
        kecepatan: true,
        fup: true,
      },
    });

    const formatted = providers.map((p) => ({
      nama: p.nama,
      nilai: [
        Number(p.tarif),       
        Number(p.kecepatan),   
        0,                     
        0,                     
        Number(p.fup),         
      ],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[API] /provider error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data provider' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nama, tarif, kecepatan, fup } = body;

  const lastProvider = await prisma.provider.findFirst({
    orderBy: {
      id_provider: 'desc',
    },
  });

  let nextNumber = 1;
  if (lastProvider && lastProvider.id_provider) {
    const match = lastProvider.id_provider.match(/\d+/); 
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }

  const newId = 'P' + nextNumber.toString().padStart(2, '0');

  const created = await prisma.provider.create({
    data: {
      id_provider: newId,
      nama,
      tarif,
      kecepatan,
      fup,
    },
  });

  return NextResponse.json(created);
}