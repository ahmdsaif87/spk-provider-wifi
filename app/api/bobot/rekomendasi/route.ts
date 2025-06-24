// File: app/api/bobot/rekomendasi/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const semua = await prisma.pembobotan.findMany();
  const total = [0, 0, 0, 0, 0];
  const count = semua.length;

  semua.forEach((d) => {
    total[0] += d.w1.toNumber();
    total[1] += d.w2.toNumber();
    total[2] += d.w3.toNumber();
    total[3] += d.w4.toNumber();
    total[4] += d.w5.toNumber();
  });

  const bobot = count > 0 ? total.map((t) => parseFloat((t / count).toFixed(4))) : [0, 0, 0, 0, 0];
  return NextResponse.json({ bobot });
}
