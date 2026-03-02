import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarViewProps {
  onClose: () => void;
}

export function CalendarView({ onClose }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // 2026年2月

  // 模拟数据
  const recordedDays = [1, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
  const today = 27;
  const totalDays = 26; // 打卡天数
  const streakDays = 7; // 连续天数

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const renderCalendar = () => {
    const days = [];
    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }
    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
      const isRecorded = recordedDays.includes(day);
      const isToday = day === today;
      const isInStreak = day >= 8 && day <= 21; // 连续打卡区间

      days.push(
        <motion.div
          key={day}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: day * 0.01 }}
          className={`
            aspect-square flex items-center justify-center rounded-full text-sm
            ${isToday ? 'bg-[#4FC3F7] text-white' : ''}
            ${!isToday && isRecorded && isInStreak ? 'bg-[#FF9F43] text-white' : ''}
            ${!isToday && isRecorded && !isInStreak ? 'bg-[#FF9F43]/30 text-[#FF9F43]' : ''}
            ${!isRecorded && !isToday ? 'text-[#94A3B8]' : ''}
          `}
        >
          {day}
        </motion.div>
      );
    }
    return days;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 日历卡片 */}
      <motion.div
        className="relative w-full max-w-md rounded-[32px] backdrop-blur-[20px] overflow-hidden"
        style={{
          background: '#FFF9F0',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#94A3B8]/20">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={20} className="text-[#475569]" />
          </button>
          <h2 className="text-lg text-[#475569]">连胜</h2>
          <button className="w-10 h-10 flex items-center justify-center">
            {/* 分享图标占位 */}
          </button>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-[#94A3B8]/20">
          <button className="flex-1 py-3 text-[#4FC3F7] border-b-2 border-[#4FC3F7]">
            个人连胜
          </button>
          <button className="flex-1 py-3 text-[#94A3B8]">友情连胜</button>
        </div>

        {/* 提示卡片 */}
        <div className="mx-6 my-4 p-4 rounded-[20px] bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD56B]/20 flex items-center justify-center">
              ⏰
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#475569]">
                今天就来学个单元，延续连胜！
              </p>
              <button className="text-sm text-[#4FC3F7] mt-1">延续连胜</button>
            </div>
          </div>
        </div>

        {/* 日历内容 */}
        <div className="px-6 pb-6">
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#475569]">2026年2月</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                <ChevronLeft size={18} className="text-[#94A3B8]" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                <ChevronRight size={18} className="text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 p-4 rounded-[20px] bg-white/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">✓</span>
                <span className="text-2xl text-[#FF9F43]">{totalDays}</span>
              </div>
              <p className="text-xs text-[#94A3B8]">打卡天数</p>
            </div>
            <div className="flex-1 p-4 rounded-[20px] bg-white/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">💧</span>
                <span className="text-2xl text-[#4FC3F7]">{streakDays}</span>
              </div>
              <p className="text-xs text-[#94A3B8]">连续打卡天数</p>
              <div className="mt-2 px-2 py-1 rounded-full bg-[#FFD56B]/20 inline-block">
                <span className="text-xs text-[#FF9F43]">优秀</span>
              </div>
            </div>
          </div>

          {/* 日历网格 */}
          <div
            className="rounded-[24px] p-5 backdrop-blur-[10px]"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              boxShadow: `
                inset 2px 2px 5px rgba(255, 255, 255, 1),
                inset -3px -3px 7px rgba(0, 0, 0, 0.05)
              `,
            }}
          >
            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm text-[#94A3B8]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>
          </div>

          {/* 连胜目标 */}
          <div className="mt-6">
            <h4 className="text-sm text-[#475569] mb-3">连胜目标</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-[16px] bg-white/70 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF9F43] text-white flex items-center justify-center">
                  ✓
                </div>
                <span className="text-sm text-[#475569]">连续打卡7天</span>
              </div>
              <div className="p-3 rounded-[16px] bg-white/40 flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-[#94A3B8] text-white flex items-center justify-center text-xs">
                  14
                </div>
                <span className="text-sm text-[#94A3B8]">连续打卡14天</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
