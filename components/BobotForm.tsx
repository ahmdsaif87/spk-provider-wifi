'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type BobotFormProps = {
  bobot: number[];
  setBobot: (bobot: number[]) => void;
  onSubmit: (bobot: number[]) => void;
};

export default function BobotForm({ bobot, setBobot, onSubmit }: BobotFormProps) {
  const kriteriaLabels = ['Tarif', 'Kecepatan', 'Servis', 'Kelancaran', 'FUP'];
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const total = bobot.reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 1) > 0.001) {
      setError('Jumlah total bobot harus sama dengan 1.');
      return;
    }

    setError('');
    onSubmit(bobot);
  };

  const handleReset = () => {
    setBobot(new Array(bobot.length).fill(0));
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {bobot.map((b, i) => (
          <div key={i} className="flex flex-col items-start">
            <label className="text-xs text-muted-foreground mb-1">
              {kriteriaLabels[i]}
            </label>
            <Input
              type="number"
              step="0.01"
              value={b}
              onChange={(e) => {
                const updated = [...bobot];
                updated[i] = parseFloat(e.target.value);
                setBobot(updated);
              }}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <div className="flex gap-2 mt-2 items-center justify-between">
        <Button type="submit" className="w-70">Hitung Ranking</Button>
        <Button type="button" variant="outline" className="w-70" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
