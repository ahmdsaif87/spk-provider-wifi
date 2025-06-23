export function hitungSAW(kriteria: any[], alternatif: any[], bobot: number[]) {
  const normalisasi = alternatif.map(alt => ({
    nama: alt.nama,
    nilai: alt.nilai.map((v: number, i: number) => {
      const kolom = alternatif.map((a: any) => a.nilai[i]);
      const max = Math.max(...kolom);
      const min = Math.min(...kolom);
      return kriteria[i].tipe === 'benefit' ? v / max : min / v;
    })
  }));

  const hasil = normalisasi.map(alt => ({
    nama: alt.nama,
    skor: alt.nilai.reduce((acc: number, v: number, i: number) => acc + v * bobot[i], 0),
  }));

  return hasil.sort((a, b) => b.skor - a.skor);
}