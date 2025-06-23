import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data/bobot-dummy.json');
  const file = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(file);

  const total = [0, 0]; // [service, kelancaran]
  let count = 0;

  for (const d of data) {
    for (const penilaian of d.penilaian) {
      total[0] += penilaian.service ?? 0;
      total[1] += penilaian.kelancaran ?? 0;
      count++;
    }
  }

  const avg = total.map((v) => parseFloat((v / count).toFixed(4)));

  const finalBobot = [0.2, 0.2, avg[0], avg[1], 0.2];
  const totalBobot = finalBobot.reduce((a, b) => a + b, 0);
  const normalized = finalBobot.map((b) => parseFloat((b / totalBobot).toFixed(4)));

  return NextResponse.json({ bobot: normalized });
}
