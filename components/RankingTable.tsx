'use client';

import { Card, CardContent } from '@/components/ui/card';

type Ranking = { nama: string; nilai: number; ranking: number };
export default function RankingTable({ data }: { data: Ranking[] }) {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2">Ranking</th>
              <th className="border p-2">Provider</th>
              <th className="border p-2">Skor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{item.nama}</td>
                <td className="border p-2">
                  {typeof item.nilai === 'number' && !isNaN(item.nilai)
                    ? item.nilai.toFixed(4)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}