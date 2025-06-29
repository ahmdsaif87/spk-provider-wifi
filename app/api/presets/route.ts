import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const presets = await prisma.pembobotan.findMany({
      include: {
        customer: {
          select: { nama: true },
        },
      },
    });

    const result = presets.map((p) => ({
      id_pembobotan: p.id_pembobotan,
      nama: p.customer?.nama ?? 'Tanpa Nama',
      bobot: JSON.stringify([p.w1, p.w2, p.w3, p.w4, p.w5]),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] /presets error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data preset' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id_customer, tanggal, bobot } = await req.json();

    const created = await prisma.pembobotan.create({
      data: {
        id_pembobotan: 'PB-' + nanoid(6),
        id_customer,
        tanggal: new Date(tanggal),
        w1: bobot[0],
        w2: bobot[1],
        w3: bobot[2],
        w4: bobot[3],
        w5: bobot[4],
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error('[API] /presets POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat pembobotan' }, { status: 500 });
  }
}
