'use client';

import { motion } from 'framer-motion';

/**
 * 색상 변화 배경 애니메이션
 *
 * 부드러운 그라데이션 색상 전환으로 동적인 배경 효과 제공
 *
 * @example <AnimatedBackground />
 */
export function AnimatedBackground() {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden min-h-screen'>
      {/* 메인 배경 - 색상 변화 애니메이션 */}
      <motion.div
        className='absolute inset-0'
        animate={{
          background: [
            'linear-gradient(45deg, #000000, #1a1a1a, #404040)', // 블랙 → 다크 그레이
            'linear-gradient(135deg, #1a1a1a, #404040, #666666)',
            'linear-gradient(225deg, #404040, #666666, #999999)',
            'linear-gradient(315deg, #666666, #404040, #1a1a1a)',
            'linear-gradient(45deg, #000000, #1a1a1a, #404040)',
          ],
        }}
        transition={{
          duration: 8, // 부드러운 전환 속도
          repeat: Infinity,
          ease: 'easeInOut', // 부드러운 전환
        }}
      />
    </div>
  );
}
