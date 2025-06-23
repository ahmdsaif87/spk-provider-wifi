'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function BobotForm({
    onSubmit,
    bobot,
    setBobot,
}: {
    onSubmit: (bobot: number[]) => void;
    bobot: number[];
    setBobot: (bobot: number[]) => void;
}) {
    const [error, setError] = useState('');

    const handleChange = (i: number, value: string) => {
        const updated = [...bobot];
        updated[i] = parseFloat(value);
        setBobot(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = bobot.reduce((a, b) => a + b, 0);
        if (Math.abs(total - 1) > 0.001) {
            setError('Total bobot harus = 1');
            return;
        }
        setError('');
        onSubmit(bobot);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {['Tarif', 'Kecepatan', 'Service', 'Kestabilan', 'FUP'].map((label, i) => (
                <div key={i} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={bobot[i]}
                        onChange={(e) => handleChange(i, e.target.value)}
                        required
                    />
                </div>
            ))}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit">Hitung</Button>
        </form>
    );
}