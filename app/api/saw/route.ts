import { NextResponse } from 'next/server';
import { hitungSAW } from '@/lib/saw';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const { bobot } = await req.json();

    const provider = await prisma.provider.findMany();
    const penilaian = await prisma.penilaian.findMany();

    const alternatif = provider.map((p) => {
        const nilai = penilaian.filter((pn) => pn.id_provider === p.id_provider);
        const avgServis = nilai.length
            ? nilai.reduce((a, b) => a + b.servis.toNumber(), 0) / nilai.length
            : 0;
        const avgLancar = nilai.length
            ? nilai.reduce((a, b) => a + b.kelancaran.toNumber(), 0) / nilai.length
            : 0;
        return {
            nama: p.nama,
            nilai: [
                p.tarif.toNumber(),
                p.kecepatan.toNumber(),
                avgServis,
                avgLancar,
                p.fup.toNumber(),
            ],
        };
    });

    const hasil = hitungSAW(alternatif, bobot);
    return NextResponse.json(hasil);
}
