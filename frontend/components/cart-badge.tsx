'use client';

import { useEffect, useState } from 'react';

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/cart', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setCount(data?.item_count ?? 0))
      .catch(() => setCount(0));
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white md:relative md:right-auto md:top-auto md:ml-1">
      {count}
    </span>
  );
}
