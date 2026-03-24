'use client';

import Link from 'next/link';
import CattleForm from '../../components/CattleForm';
import Card from '../../components/ui/Card';

export default function NewCattlePage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link href="/cattle" className="text-primary no-underline text-sm font-body font-medium">
        ← Volver a Ganado
      </Link>
      <h1 className="font-heading text-2xl font-bold text-on-surface mt-4 mb-6">
        Nuevo Animal
      </h1>
      <Card>
        <CattleForm />
      </Card>
    </div>
  );
}
