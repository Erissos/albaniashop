import { Baby, Dumbbell, Home, Laptop, Palette, ShoppingBag, Shirt, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  kadin: Shirt,
  erkek: User,
  'ev-yasam': Home,
  kozmetik: Palette,
  elektronik: Laptop,
  'ayakkabi-canta': ShoppingBag,
  'anne-cocuk': Baby,
  'spor-outdoor': Dumbbell,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = iconMap[slug] ?? ShoppingBag;
  return <Icon className={className} />;
}
