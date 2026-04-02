'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, MessageSquarePlus } from 'lucide-react';

type ProductQuestionFormProps = {
  productId: number;
  productName: string;
};

function extractErrorMessage(data: unknown, fallback: string) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && typeof data[0] === 'string') return data[0];
  if (typeof data === 'object') {
    const values = Object.values(data as Record<string, unknown>);
    for (const value of values) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }
  return fallback;
}

export function ProductQuestionForm({ productId, productName }: ProductQuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setError('');
    setRequiresLogin(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productId, question }),
      });

      if (response.status === 401 || response.status === 403) {
        setRequiresLogin(true);
        setError('Soru göndermek için hesabınıza giriş yapmanız gerekiyor.');
        return;
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data, 'Sorunuz gönderilemedi.'));
        return;
      }

      setQuestion('');
      setStatus('Sorunuz alındı. Yanıt geldiğinde Hesabım > Soru ve Taleplerim bölümünde görebilirsiniz.');
    } catch {
      setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-card border border-border bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <MessageSquarePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">Ürün Hakkında Soru Sor</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {productName} için beden, kumaş, teslimat veya kullanım detaylarını sorabilirsiniz.
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="input-field min-h-32"
          placeholder="Sorunuzu yazın"
          required
          minLength={10}
        />

        {error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            <p>{error}</p>
            {requiresLogin ? (
              <Link href="/account" className="mt-2 inline-flex font-semibold text-primary hover:underline">
                Giriş yapmak için hesabıma git
              </Link>
            ) : null}
          </div>
        ) : null}

        {status ? <p className="rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">{status}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted">Yanıtlar yalnızca hesabınızdaki soru geçmişinde gösterilir.</p>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-70">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Soruyu Gönder
          </button>
        </div>
      </form>
    </div>
  );
}