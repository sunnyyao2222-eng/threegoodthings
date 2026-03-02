import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoodThingInput } from './GoodThingInput';
import { TreeView } from './TreeView';
import { ChevronDown, ChevronUp, Calendar as CalendarIcon, Crown } from 'lucide-react';
import aiLogo from 'figma:asset/c268dda471e80991145aa7fb4de4c5759a099bb5.png';

interface GoodThing {
  id: number;
  content: string;
  completed: boolean;
  feedback?: string;
}

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
}

interface HomeViewProps {
  streak: number;
  treePoints: number;
  treeStage: number;
  onPointsChange: (points: number) => void;
  onStageChange: (stage: number) => void;
  onShowCalendar: () => void;
  onShowAIChat: () => void;
  isVIP: boolean;
  onShowVIPUpgrade: () => void;
}

export function HomeView({
  streak,
  treePoints,
  treeStage,
  onPointsChange,
  onStageChange,
  onShowCalendar,
  onShowAIChat,
  isVIP,
  onShowVIPUpgrade,
}: HomeViewProps) {
  const [activeInput, setActiveInput] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  
  const maxThings = isVIP ? 6 : 3;
  
  const [goodThings, setGoodThings] = useState<GoodThing[]>(
    Array.from({ length: maxThings }, (_, i) => ({
      id: i + 1,
      content: '',
      completed: false,
    }))
  );

  const completedCount = goodThings.filter((gt) => gt.completed).length;
  const currentThing = goodThings.find((gt) => !gt.completed);
  const currentIndex = currentThing ? goodThings.indexOf(currentThing) : 0;
  const canAddMore = completedCount >= 3 && !isVIP;

  const bubbleColors = ['#FF7E95', '#FFD56B', '#FF9F43', '#A7F3D0', '#FFA6C9'];

  const handleSubmit = (index: number, content: string) => {
    const feedbacks = [
      '真好啊，这样的小确幸值得被记住 ✨',
      '看起来是很温暖的一刻呢 💕',
      '能感受到这份美好，你真幸运 🌟',
      '这个瞬间，一定很特别吧 🌸',
      '谢谢你分享这份美好 🌈',
    ];

    const newGoodThings = [...goodThings];
    newGoodThings[index] = {
      ...newGoodThings[index],
      content,
      completed: true,
      feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)],
    };
    setGoodThings(newGoodThings);

    // 增加积分
    const points = content.length > 20 ? 7 : 5;
    const newPoints = treePoints + points;
    onPointsChange(newPoints);

    // 检查是否升级
    const stages = [0, 50, 200, 500, 1200, 3000];
    for (let i = stages.length - 1; i >= 0; i--) {
      if (newPoints >= stages[i]) {
        onStageChange(i);
        break;
      }
    }

    // 添加漂浮气泡
    const newBubble: FloatingBubble = {
      id: Date.now(),
      x: 30 + Math.random() * 40, // 30-70% 范围
      y: 40 + Math.random() * 20, // 40-60% 范围
      delay: 0,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    };
    setBubbles([...bubbles, newBubble]);

    // 3秒后移除气泡（让它完成动画）
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 4000);

    // 找到下一个未完成的输入框
    const nextIndex = newGoodThings.findIndex((gt) => !gt.completed);
    if (nextIndex !== -1) {
      setActiveInput(nextIndex);
    }
  };

  const completedThings = goodThings.filter((gt) => gt.completed);
  const hasCompleted = completedThings.length > 0;

  return (
    <div className="pb-32 px-4 pt-8">
      {/* 顶部信息栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-[10px]">
            <span>🔥</span>
            <span className="text-sm" style={{ color: '#FF9F43' }}>
              连续 {streak} 天
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-[10px]">
            <span className="text-sm" style={{ color: '#FF7E95' }}>
              {completedCount}/{maxThings}
            </span>
          </div>
          {isVIP && (
            <div
              className="flex items-center gap-1 px-3 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFD56B, #FF9F43)',
              }}
            >
              <Crown size={14} className="text-white" />
              <span className="text-xs text-white font-medium">VIP</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* AI助手按钮 */}
          <motion.button
            onClick={onShowAIChat}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-[10px] overflow-hidden relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255, 126, 149, 0.4)',
                '0 0 0 8px rgba(255, 126, 149, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={aiLogo} alt="AI助手" className="w-full h-full object-cover" />
          </motion.button>

          {/* 日历按钮 */}
          <button
            onClick={onShowCalendar}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-[10px] transition-transform active:scale-95"
          >
            <CalendarIcon size={20} className="text-[#FF7E95]" />
          </button>
        </div>
      </motion.div>

      {/* 小树展示区 - 带气泡 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <TreeView stage={treeStage} points={treePoints} bubbles={bubbles} />
      </motion.div>

      {/* 当前输入框 - 首屏显示 */}
      {completedCount < maxThings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GoodThingInput
            key={currentIndex}
            index={currentIndex}
            isActive={true}
            isCompleted={false}
            onFocus={() => setActiveInput(currentIndex)}
            onSubmit={(content) => handleSubmit(currentIndex, content)}
          />
        </motion.div>
      )}

      {/* VIP升级提示 - 完成3件后显示 */}
      {canAddMore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div
            className="rounded-[28px] p-6 backdrop-blur-[10px] text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 107, 0.3), rgba(255, 159, 67, 0.3))',
              boxShadow: `
                inset 2px 2px 5px rgba(255, 255, 255, 1),
                inset -3px -3px 7px rgba(0, 0, 0, 0.05),
                0 10px 30px rgba(255, 159, 67, 0.2)
              `,
            }}
          >
            <div className="mb-4">
              <Crown size={48} className="mx-auto text-[#FF9F43]" />
            </div>
            <h3 className="text-lg text-[#475569] mb-2">想要记录更多美好？</h3>
            <p className="text-sm text-[#94A3B8] mb-4">
              升级 VIP 会员，每日最多记录 6 件好事
              <br />
              让小树获得更多成长能量
            </p>
            <motion.button
              onClick={onShowVIPUpgrade}
              className="px-8 py-3 rounded-full text-white font-medium"
              style={{
                background: 'linear-gradient(135deg, #FFD56B, #FF9F43)',
                boxShadow: '0 4px 12px rgba(255, 159, 67, 0.4)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              立即升级 VIP
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 完成庆祝 */}
      {completedCount === maxThings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 text-center"
        >
          <div
            className="inline-block px-8 py-6 rounded-[28px] backdrop-blur-[10px]"
            style={{
              background: 'rgba(255, 215, 107, 0.3)',
              boxShadow: `
                inset 2px 2px 5px rgba(255, 255, 255, 1),
                inset -3px -3px 7px rgba(0, 0, 0, 0.05),
                0 10px 30px rgba(255, 215, 107, 0.3)
              `,
            }}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl text-[#475569] mb-2">太棒了！</h3>
            <p className="text-[#94A3B8]">
              今天的{maxThings}件好事已记录完成
            </p>
            <p className="text-sm text-[#94A3B8] mt-2">
              你的小树获得了成长能量
            </p>

            <motion.button
              className="mt-4 px-6 py-2 rounded-full text-white text-sm"
              style={{
                background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              分享今天的好心情
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 已完成的记录 - 可折叠 */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-[24px] bg-white/70 backdrop-blur-[10px] mb-4 transition-colors hover:bg-white/90"
          >
            <span className="text-[#475569]">
              今日已记录 ({completedThings.length} 件)
            </span>
            {showCompleted ? (
              <ChevronUp size={20} className="text-[#94A3B8]" />
            ) : (
              <ChevronDown size={20} className="text-[#94A3B8]" />
            )}
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {completedThings.map((thing) => {
                  const originalIndex = goodThings.indexOf(thing);
                  return (
                    <GoodThingInput
                      key={thing.id}
                      index={originalIndex}
                      isActive={false}
                      isCompleted={true}
                      onFocus={() => {}}
                      onSubmit={() => {}}
                      aiFeedback={thing.feedback}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
