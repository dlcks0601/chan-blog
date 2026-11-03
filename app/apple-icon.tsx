import { ImageResponse } from 'next/og';
import { MarkIconImage } from '@/shared/ui';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<MarkIconImage size={180} cell={12} />, size);
}
