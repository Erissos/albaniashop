'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  productId: number;
  initialAdded?: boolean;
  onChange?: (added: boolean) => void;
  className?: string;
  activeClassName?: string;
  iconClassName?: string;
  pendingClassName?: string;
  label?: string;
};

export function WishlistButton({
  productId,
  initialAdded = false,
  onChange,
  className = 'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft',
  activeClassName = 'text-danger',
  iconClassName = 'h-4 w-4',
  pendingClassName = 'opacity-70',
  label,
}: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(initialAdded);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setAdded(initialAdded);
  }, [initialAdded]);

  async function toggle() {
    setPending(true);
    try {
      const method = added ? 'DELETE' : 'POST';
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.status === 401 || res.status === 403) {
        router.push('/account');
        return;
      }
      if (res.ok || res.status === 200 || res.status === 201) {
        const nextAdded = !added;
        setAdded(nextAdded);
        onChange?.(nextAdded);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`${className} transition ${added ? activeClassName : 'text-muted hover:text-danger'} ${pending ? pendingClassName : ''}`}
      aria-label={added ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart className={`${iconClassName} ${added ? 'fill-danger' : ''}`} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}
