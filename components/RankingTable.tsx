export default function RankingTable({ data }: { data: { nama: string; nilai: number }[] }) {
  return (
    <div className="mt-3">
      <h2 className="font-bold mb-2">Hasil Ranking</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-2">Ranking</th>
            <th className="border p-2">Provider</th>
            <th className="border p-2">Skor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{d.nama}</td>
              <td className="border p-2 text-center">{d.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
