import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.bobotPreset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
