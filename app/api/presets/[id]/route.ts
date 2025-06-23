import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '0');

  const body = await req.json();
  const updated = await prisma.bobotPreset.update({
    where: { id },
    data: {
      nama: body.nama,
      bobot: JSON.stringify(body.bobot),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split('/').pop() || '0');

  await prisma.bobotPreset.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
