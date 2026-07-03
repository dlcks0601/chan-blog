import { cn } from '@/shared/lib/utils';

type Props = {
  label: string;
};

/** Subtle brand-color hint per tech. Unknown tech falls back to neutral. */
const TECH_COLORS: Record<string, string> = {
  'React Native': '#61DAFB',
  React: '#61DAFB',
  'Next.js': '#E5E7EB',
  Expo: '#8E8CFF',
  NativeWind: '#38BDF8',
  'Tailwind CSS': '#38BDF8',
  TypeScript: '#3178C6',
  JavaScript: '#F0DB4F',
  'Framer Motion': '#FF57C7',
  Zustand: '#C084FC',
  'React Query': '#FF5C8A',
  Nginx: '#4CAF7D',
  EC2: '#FF9F45',
  'AWS(EC2, RDS)': '#FF9F45',
  PM2: '#5CC5D6',
  NestJS: '#E0234E',
  Prisma: '#9AA6FF',
};

const NEUTRAL = '#c9c9c9';

/**
 * Apple-style liquid glass badge: translucent surface, backdrop blur,
 * a soft edge highlight — with a faint brand-color tint per tech.
 */
export function TechBadge({ label }: Props) {
  const color = TECH_COLORS[label] ?? NEUTRAL;

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2 overflow-hidden',
        'rounded-full px-3 py-1',
        'text-[11px] font-jetbrains-medium text-white/80',
        'border border-white/10',
        'bg-gradient-to-b from-white/[0.07] to-white/[0.03]',
        'backdrop-blur-md backdrop-saturate-150',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_16px_-10px_rgba(0,0,0,0.7)]'
      )}
    >
      {/* faint brand tint */}
      <span
        className='pointer-events-none absolute inset-0'
        style={{
          background: `radial-gradient(120% 140% at 18% -30%, ${color}, transparent 62%)`,
          opacity: 0.16,
        }}
      />
      {/* soft top sheen */}
      <span className='pointer-events-none absolute inset-x-0 top-0 h-2/5 rounded-t-full bg-gradient-to-b from-white/[0.08] to-transparent' />
      <span
        className='relative h-1.5 w-1.5 rounded-full'
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}55` }}
      />
      <span className='relative'>{label}</span>
    </span>
  );
}
