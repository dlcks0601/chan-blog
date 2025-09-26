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
    <div className='fixed inset-0 -z-10 overflow-hidden'>
      {/* 메인 배경 - 색상 변화 애니메이션 */}
      <motion.div
        className='absolute inset-0'
        animate={{
          background: [
            'linear-gradient(45deg, #000000, #1a1a1a, #333333)', // 검정 → 진한 회색
            'linear-gradient(135deg, #1a1a1a, #2d2d2d, #404040)', // 진한 회색 → 회색
            'linear-gradient(225deg, #2d2d2d, #1a1a1a, #000000)', // 회색 → 검정
            'linear-gradient(315deg, #000000, #0d0d0d, #262626)', // 검정 → 어두운 회색
            'linear-gradient(45deg, #000000, #1a1a1a, #333333)', // 원점 복귀
          ],
        }}
        transition={{
          duration: 20, // 전체 사이클 시간 (초) - 커스터마이징 포인트
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
