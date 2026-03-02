import { motion } from 'motion/react';

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
}

interface TreeViewProps {
  stage: number;
  points: number;
  bubbles?: FloatingBubble[];
}

export function TreeView({ stage, points, bubbles = [] }: TreeViewProps) {
  const treeEmojis = ['🌱', '🌿', '🪴', '🌳', '🌲', '🎄'];
  const stageTitles = ['种子', '幼苗', '小树', '成长树', '大树', '参天大树'];
  const stagePoints = [0, 50, 200, 500, 1200, 3000];

  const currentStage = Math.min(stage, treeEmojis.length - 1);
  const nextStagePoints = stagePoints[currentStage + 1] || stagePoints[stagePoints.length - 1];
  const progress = ((points - stagePoints[currentStage]) / (nextStagePoints - stagePoints[currentStage])) * 100;

  return (
    <div className="relative">
      {/* 主卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[32px] p-8 backdrop-blur-[10px] relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            10px 10px 20px rgba(166, 180, 200, 0.15)
          `,
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 107, 0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </div>

        {/* 树木展示 */}
        <div className="text-center mb-6 relative">
          <motion.div
            className="text-8xl mb-4 inline-block"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            {treeEmojis[currentStage]}
          </motion.div>

          {/* 漂浮的小气泡 - 好事养料 */}
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute w-6 h-6 rounded-full flex items-center justify-center text-sm"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                background: bubble.color,
                boxShadow: `0 0 15px ${bubble.color}, 0 0 30px ${bubble.color}80`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.8],
                scale: [0, 1, 1, 0.9],
                y: [0, -10, -20, -30],
                x: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
              }}
              transition={{
                duration: 4,
                delay: bubble.delay,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.div>
          ))}

          <h3 className="text-lg text-[#475569] mb-2">{stageTitles[currentStage]}</h3>
          <p className="text-sm text-[#94A3B8]">
            {points} / {nextStagePoints} 成长值
          </p>
        </div>

        {/* 进度条 */}
        <div className="relative">
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FF7E95, #FFD56B, #FF9F43)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* 进度点 */}
          <div className="absolute -top-1 left-0 right-0 flex justify-between px-1">
            {stagePoints.slice(0, -1).map((point, index) => {
              const isReached = points >= point;
              return (
                <motion.div
                  key={point}
                  className="w-5 h-5 rounded-full border-2"
                  style={{
                    background: isReached ? '#FF7E95' : 'white',
                    borderColor: isReached ? '#FF7E95' : '#94A3B8',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              );
            })}
          </div>
        </div>

        {/* 下一阶段提示 */}
        {currentStage < treeEmojis.length - 1 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-[#94A3B8]">
              再获得 {nextStagePoints - points} 成长值升级为
            </p>
            <p className="text-sm text-[#FF7E95] mt-1">
              {stageTitles[currentStage + 1]} {treeEmojis[currentStage + 1]}
            </p>
          </div>
        )}

        {currentStage === treeEmojis.length - 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-[#FFD56B]">🎉 已达到最高等级！</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
