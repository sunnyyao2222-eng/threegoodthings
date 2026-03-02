import { motion } from 'motion/react';
import { X, Crown, Check, Sparkles } from 'lucide-react';

interface VIPUpgradeViewProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export function VIPUpgradeView({ onClose, onUpgrade }: VIPUpgradeViewProps) {
  const benefits = [
    '每日记录上限提升至 6 件好事',
    '解锁高级 AI 分析报告',
    '专属 VIP 徽章和树木装饰',
    '优先获得新功能体验',
    '更多成长值加成',
    '云端数据无限存储',
  ];

  const plans = [
    {
      title: '月度会员',
      price: '¥19',
      period: '/月',
      popular: false,
    },
    {
      title: '年度会员',
      price: '¥168',
      period: '/年',
      popular: true,
      save: '省 ¥60',
    },
    {
      title: '终身会员',
      price: '¥398',
      period: '一次性',
      popular: false,
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* VIP卡片 */}
      <motion.div
        className="relative w-full max-w-md rounded-[32px] backdrop-blur-[20px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE8CC 100%)',
          boxShadow: '0 20px 60px rgba(255, 159, 67, 0.4)',
        }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部装饰 */}
        <div
          className="h-32 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FF7E95, #FFD56B, #FF9F43)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
            }}
            animate={{
              x: [-20, 20, -20],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown size={48} className="text-white" />
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl text-[#475569] mb-2">升级 VIP 会员</h2>
            <p className="text-sm text-[#94A3B8]">
              解锁更多功能，让成长更加精彩
            </p>
          </div>

          {/* 权益列表 */}
          <div className="mb-6 space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF7E95]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-[#FF7E95]" />
                </div>
                <span className="text-sm text-[#475569]">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* 套餐选择 */}
          <div className="space-y-3 mb-6">
            {plans.map((plan, index) => (
              <motion.button
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={onUpgrade}
                className="w-full p-4 rounded-[24px] flex items-center justify-between transition-all relative overflow-hidden"
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(255, 126, 149, 0.2), rgba(255, 215, 107, 0.2))'
                    : 'rgba(255, 255, 255, 0.7)',
                  border: plan.popular
                    ? '2px solid #FF7E95'
                    : '2px solid rgba(148, 163, 184, 0.2)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 推荐标签 */}
                {plan.popular && (
                  <div className="absolute top-0 right-4">
                    <div
                      className="px-3 py-1 rounded-b-[12px] text-xs text-white flex items-center gap-1"
                      style={{
                        background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                      }}
                    >
                      <Sparkles size={12} />
                      <span>最受欢迎</span>
                    </div>
                  </div>
                )}

                <div className="text-left">
                  <h4 className="text-[#475569] font-medium mb-1">{plan.title}</h4>
                  {plan.save && (
                    <span className="text-xs text-[#FF7E95]">{plan.save}</span>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl text-[#FF7E95] font-medium">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#94A3B8]">{plan.period}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 说明文字 */}
          <p className="text-xs text-[#94A3B8] text-center">
            订阅即表示同意《VIP服务协议》
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
