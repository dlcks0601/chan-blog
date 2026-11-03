import { ImageResponse } from 'next/og';
import { MarkIconImage } from '@/shared/ui';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<MarkIconImage size={32} cell={2} />, size);
}
