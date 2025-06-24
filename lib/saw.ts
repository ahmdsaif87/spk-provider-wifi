type Alternatif = {
  nama: string;
  nilai: number[];
};

export function hitungSAW(alternatif: Alternatif[], bobot: number[]) {
  const normal = alternatif.map((alt) => [...alt.nilai]);
  const result: { nama: string; nilai: number }[] = [];

  for (let i = 0; i < 5; i++) {
    const values = alternatif.map((alt) => alt.nilai[i]);
    const max = Math.max(...values);
    const min = Math.min(...values);

    for (let j = 0; j < alternatif.length; j++) {
      normal[j][i] = i === 0 || i === 4
        ? min / alternatif[j].nilai[i]     // Cost
        : alternatif[j].nilai[i] / max;    // Benefit
    }
  }

  for (let i = 0; i < alternatif.length; i++) {
    const nilai = normal[i].reduce((acc, n, idx) => acc + n * bobot[idx], 0);
    result.push({ nama: alternatif[i].nama, nilai: parseFloat(nilai.toFixed(4)) });
  }

  result.sort((a, b) => b.nilai - a.nilai);
  return result;
}
