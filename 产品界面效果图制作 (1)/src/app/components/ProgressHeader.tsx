import { motion } from 'motion/react';

interface ProgressHeaderProps {
  completed: number;
  total: number;
  streak: number;
}

export function ProgressHeader({ completed, total, streak }: ProgressHeaderProps) {
  const progress = (completed / total) * 100;

  return (
    <div className="mb-8">
      {/* 顶部问候 */}
      <div className="mb-6">
        <motion.h1
          className="text-3xl mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#475569' }}
        >
          今天的三件好事
        </motion.h1>
        <p className="text-[#94A3B8]">
          每一次记录，都是对生活说：谢谢你给我这一刻
        </p>
      </div>

      {/* 进度条容器 */}
      <div
        className="rounded-[24px] p-5 backdrop-blur-[10px]"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            10px 10px 20px rgba(166, 180, 200, 0.15)
          `,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl" style={{ color: '#FF7E95' }}>
              {completed}
            </span>
            <span className="text-[#94A3B8]"> / {total} 件</span>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD56B]/20">
              <span>🔥</span>
              <span style={{ color: '#FF9F43' }}>连续 {streak} 天</span>
            </div>
          )}
        </div>

        {/* 进度条 */}
        <div className="relative h-3 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FF7E95, #FFD56B)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {completed === total && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 text-center text-[#FF7E95]"
          >
            ✨ 太棒了！今天的好事已经记录完成
          </motion.div>
        )}
      </div>
    </div>
  );
}
