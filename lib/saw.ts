export type Kriteria = {
  nama: string;
  tipe: 'benefit' | 'cost';
};

export type Alternatif = {
  nama: string;
  nilai: number[]; // nilai sesuai urutan kriteria
};

export type HasilSAW = {
  nama: string;
  nilai: number;
  ranking: number;
};

export function hitungSAW(
  kriteria: Kriteria[],
  alternatif: Alternatif[],
  bobot: number[]
): HasilSAW[] {
  // Transpose matrix (kolom-kolom nilai per kriteria)
  const matrixT: number[][] = Array.from({ length: kriteria.length }, (_, i) =>
    alternatif.map((alt) => alt.nilai[i])
  );

  // Normalisasi dan hitung skor total
  const norm = alternatif.map((alt) => {
    const normVals = alt.nilai.map((v, j) => {
      const column = matrixT[j];
      if (kriteria[j].tipe === 'benefit') {
        const max = Math.max(...column);
        return v / max;
      } else {
        const min = Math.min(...column);
        return min / v;
      }
    });

    const total = normVals.reduce((sum, val, idx) => sum + val * bobot[idx], 0);

    return {
      nama: alt.nama,
      nilai: total,
    };
  });

  // Ranking berdasarkan skor tertinggi
  const sorted = norm
    .sort((a, b) => b.nilai - a.nilai)
    .map((v, i) => ({
      ...v,
      ranking: i + 1,
      nilai: parseFloat(v.nilai.toFixed(4)),
    }));

  return sorted;
}
