import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const id_pembobotan = pathname.split('/').pop() || '';
  const { bobot, tanggal } = await req.json();

  const updated = await prisma.pembobotan.update({
    where: { id_pembobotan },
    data: {
      tanggal: new Date(tanggal),
      w1: bobot[0],
      w2: bobot[1],
      w3: bobot[2],
      w4: bobot[3],
      w5: bobot[4],
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const id_pembobotan = pathname.split('/').pop() || '';

  await prisma.pembobotan.delete({ where: { id_pembobotan } });
  return NextResponse.json({ success: true });
}
