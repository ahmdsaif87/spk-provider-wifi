import { NextResponse } from 'next/server';
import { alternatif, kriteria } from '@/constants/data';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    const { bobot } = await req.json();

    if (!Array.isArray(bobot) || bobot.length !== kriteria.length) {
        return NextResponse.json({ error: 'Bobot tidak valid' }, { status: 400 });
    }

    const totalBobot = bobot.reduce((acc, val) => acc + val, 0);
    if (Math.abs(totalBobot - 1) > 0.001) {
        return NextResponse.json({ error: 'Total bobot harus = 1' }, { status: 400 });
    }

    // Load dummy service & kelancaran dari file
    const dummyPath = path.join(process.cwd(), 'data/bobot-dummy.json');
    const dummyRaw = await fs.readFile(dummyPath, 'utf-8');
    const dummy = JSON.parse(dummyRaw);

    // Hitung rata-rata untuk setiap provider
    const ratingMap: Record<string, { total: number[]; count: number }> = {};
    for (const cust of dummy) {
        for (const p of cust.penilaian) {
            if (!ratingMap[p.provider]) {
                ratingMap[p.provider] = { total: [0, 0], count: 0 };
            }
            ratingMap[p.provider].total[0] += p.service;
            ratingMap[p.provider].total[1] += p.kelancaran;
            ratingMap[p.provider].count++;
        }
    }

    // Inject ke alternatif
    const altWithUpdated = alternatif.map((alt) => {
        const rating = ratingMap[alt.nama];
        const newNilai = [...alt.nilai];

        if (
            rating &&
            rating.count > 0 &&
            typeof rating.total[0] === 'number' &&
            typeof rating.total[1] === 'number'
        ) {
            newNilai[2] = parseFloat((rating.total[0] / rating.count).toFixed(2)); // Service
            newNilai[3] = parseFloat((rating.total[1] / rating.count).toFixed(2)); // Kelancaran
        } else {
            newNilai[2] = 0;
            newNilai[3] = 0;
        }

        return { ...alt, nilai: newNilai };
    });

    // Normalisasi
    const matrixT: number[][] = Array.from({ length: kriteria.length }, (_, i) =>
        altWithUpdated.map((alt) => alt.nilai[i] ?? 0)
    );

    const norm = altWithUpdated.map((alt) => {
        const normVals = alt.nilai.map((v, j) => {
            const column = matrixT[j];
            const isBenefit = kriteria[j].tipe === 'benefit';

            const safeV = typeof v === 'number' && !isNaN(v) ? v : 0;
            const columnFiltered = column.filter((n) => typeof n === 'number' && n > 0);

            if (columnFiltered.length === 0) return 0;

            if (isBenefit) {
                const max = Math.max(...columnFiltered);
                return safeV / max;
            } else {
                const min = Math.min(...columnFiltered);
                return min / safeV;
            }
        });

        const total = normVals.reduce((sum, val, idx) => sum + val * bobot[idx], 0);

        return {
            nama: alt.nama,
            nilai: typeof total === 'number' && !isNaN(total) ? total : 0,
        };
    });

    const sorted = norm
        .sort((a, b) => b.nilai - a.nilai)
        .map((v, i) => ({
            ...v,
            ranking: i + 1,
            nilai: typeof v.nilai === 'number' && !isNaN(v.nilai)
                ? parseFloat(v.nilai.toFixed(4))
                : 0,
        }));

    return NextResponse.json(sorted);
}
