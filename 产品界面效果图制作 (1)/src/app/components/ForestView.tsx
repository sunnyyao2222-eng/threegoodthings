import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Heart, Copy } from 'lucide-react';

interface ForestItem {
  id: number;
  content: string;
  x: number;
  y: number;
  color: string;
  resonanceCount: number;
}

interface ForestViewProps {
  onCopyToMyRecord?: (content: string) => void;
}

export function ForestView({ onCopyToMyRecord }: ForestViewProps) {
  const [selectedItem, setSelectedItem] = useState<ForestItem | null>(null);
  const [resonated, setResonated] = useState<number[]>([]);
  const [copied, setCopied] = useState<number[]>([]);

  // 模拟其他用户的好事数据
  const [forestItems] = useState<ForestItem[]>([
    {
      id: 1,
      content: '今天猫咪终于在我腿上睡着了',
      x: 20,
      y: 15,
      color: '#A7F3D0',
      resonanceCount: 42,
    },
    {
      id: 2,
      content: '下班路上看到了超美的晚霞',
      x: 70,
      y: 25,
      color: '#FF7E95',
      resonanceCount: 128,
    },
    {
      id: 3,
      content: '第一次做的蛋糕竟然成功了',
      x: 85,
      y: 40,
      color: '#FFD56B',
      resonanceCount: 56,
    },
    {
      id: 4,
      content: '朋友记得我随口提过的小事',
      x: 15,
      y: 60,
      color: '#FF9F43',
      resonanceCount: 89,
    },
    {
      id: 5,
      content: '早上醒来发现下雨了不用浇花',
      x: 50,
      y: 70,
      color: '#A7F3D0',
      resonanceCount: 34,
    },
    {
      id: 6,
      content: '地铁上有人给我让座',
      x: 80,
      y: 65,
      color: '#FF7E95',
      resonanceCount: 71,
    },
    {
      id: 7,
      content: '终于完成了拖延很久的任务',
      x: 35,
      y: 35,
      color: '#FFD56B',
      resonanceCount: 45,
    },
    {
      id: 8,
      content: '发现冰箱里还有昨天的甜点',
      x: 60,
      y: 50,
      color: '#FF9F43',
      resonanceCount: 23,
    },
  ]);

  const handleResonance = (id: number) => {
    if (!resonated.includes(id)) {
      setResonated([...resonated, id]);
    }
  };

  const handleCopy = (item: ForestItem) => {
    if (!copied.includes(item.id)) {
      setCopied([...copied, item.id]);
      if (onCopyToMyRecord) {
        onCopyToMyRecord(item.content);
      }
      // 提示已复制
      setTimeout(() => {
        setSelectedItem(null);
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#1a1625] via-[#2D1B36] to-[#1a1625] overflow-hidden">
      {/* 标题 */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg tracking-[0.3em] text-white/40 uppercase"
        >
          Resonance Forest
        </motion.h2>
        <p className="text-sm text-white/30 mt-2">
          共鸣之森 · 感受他人的美好
        </p>
      </div>

      {/* 发光粒子 - 代表其他用户的好事 */}
      <div className="absolute inset-0">
        {forestItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="absolute cursor-pointer"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + index * 0.3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            onClick={() => setSelectedItem(item)}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* 发光圆点 */}
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: item.color,
                boxShadow: `0 0 20px ${item.color}, 0 0 40px ${item.color}`,
              }}
            />
            
            {/* 外圈光晕 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${item.color}`,
                opacity: 0.3,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* 弹出卡片 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* 卡片内容 */}
            <motion.div
              className="relative max-w-md w-full rounded-[32px] p-8 backdrop-blur-[20px]"
              style={{
                background: 'rgba(45, 27, 54, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `
                  0 0 60px ${selectedItem.color}40,
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={16} className="text-white/60" />
              </button>

              {/* 发光装饰 */}
              <motion.div
                className="w-12 h-12 mx-auto mb-6 rounded-full"
                style={{
                  background: selectedItem.color,
                  boxShadow: `0 0 40px ${selectedItem.color}`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              {/* 内容 */}
              <p className="text-white/90 text-lg text-center italic leading-relaxed mb-8">
                "{selectedItem.content}"
              </p>

              {/* 操作按钮 */}
              <div className="space-y-3">
                {/* 共鸣按钮 */}
                <motion.button
                  onClick={() => handleResonance(selectedItem.id)}
                  className="w-full py-4 rounded-full flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: resonated.includes(selectedItem.id)
                      ? 'rgba(255, 126, 149, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart
                    size={20}
                    className={
                      resonated.includes(selectedItem.id)
                        ? 'text-[#FF7E95] fill-[#FF7E95]'
                        : 'text-white/60'
                    }
                  />
                  <span className="text-white/80">
                    {resonated.includes(selectedItem.id)
                      ? '已共鸣'
                      : '我也有同感'}
                  </span>
                </motion.button>

                {/* 复制到我的记录按钮 */}
                <motion.button
                  onClick={() => handleCopy(selectedItem)}
                  className="w-full py-4 rounded-full flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: copied.includes(selectedItem.id)
                      ? 'rgba(167, 243, 208, 0.3)'
                      : 'rgba(255, 215, 107, 0.2)',
                    border: '1px solid rgba(255, 215, 107, 0.3)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Copy
                    size={20}
                    className={
                      copied.includes(selectedItem.id)
                        ? 'text-[#A7F3D0]'
                        : 'text-[#FFD56B]'
                    }
                  />
                  <span className="text-white/80">
                    {copied.includes(selectedItem.id)
                      ? '已复制到我的记录'
                      : '复制到我的记录'}
                  </span>
                </motion.button>
              </div>

              {/* 共鸣数 */}
              <div className="mt-4 text-center text-sm text-white/40">
                {selectedItem.resonanceCount +
                  (resonated.includes(selectedItem.id) ? 1 : 0)}{' '}
                人产生了共鸣
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示文字 */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <motion.p
          className="text-white/30 text-sm"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          点击光点，查看他人的美好时刻
        </motion.p>
      </div>
    </div>
  );
}
