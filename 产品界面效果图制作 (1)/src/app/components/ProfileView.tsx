import { motion } from 'motion/react';
import { Share2, LogOut, Download, Award, Calendar, Flame, TrendingUp, Heart, Zap, Crown, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  onWechatLogin?: () => void;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    type: 'guest' | 'wechat' | 'google' | 'email';
  } | null;
  onShowLogin: () => void;
  onLogout: () => void;
  isVIP: boolean;
  onShowVIPUpgrade: () => void;
}

export function ProfileView({ onWechatLogin, user, onShowLogin, onLogout, isVIP, onShowVIPUpgrade }: ProfileViewProps) {
  const isGuest = user?.type === 'guest';
  const isLoggedIn = !!user;

  const stats = [
    { icon: Calendar, label: '记录天数', value: '45', color: '#FF7E95' },
    { icon: Flame, label: '连续打卡', value: '7', color: '#FF9F43' },
    { icon: Award, label: '解锁成就', value: '8', color: '#FFD56B' },
  ];

  const achievements = [
    { emoji: '🌱', name: '初心者', unlocked: true },
    { emoji: '🔥', name: '火苗习惯', unlocked: true },
    { emoji: '💧', name: '细水流长', unlocked: false },
    { emoji: '🌊', name: '感恩达人', unlocked: false },
    { emoji: '🎨', name: '生活艺术家', unlocked: false },
    { emoji: '🌙', name: '夜猫记录者', unlocked: true },
  ];

  const handleShare = () => {
    // 分享逻辑
    alert('分享功能：生成专属海报或分享链接');
  };

  const handleExport = () => {
    // 导出数据逻辑
    alert('导出功能：下载所有记录数据');
  };

  return (
    <div className="pb-32 px-4 pt-8">
      {/* VIP卡片 - 最顶部 */}
      {!isVIP && isLoggedIn && !isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] p-6 backdrop-blur-[10px] mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 107, 0.3), rgba(255, 159, 67, 0.3))',
            boxShadow: `
              inset 2px 2px 5px rgba(255, 255, 255, 1),
              inset -3px -3px 7px rgba(0, 0, 0, 0.05),
              10px 10px 20px rgba(255, 159, 67, 0.2)
            `,
          }}
        >
          {/* 装饰性光效 */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 107, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={24} className="text-[#FF9F43]" />
                  <h3 className="text-lg text-[#475569] font-medium">升级 VIP</h3>
                </div>
                <p className="text-sm text-[#94A3B8]">
                  解锁更多功能，记录更多美好
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF9F43]/20">
                <Sparkles size={14} className="text-[#FF9F43]" />
                <span className="text-xs text-[#FF9F43]">限时优惠</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#475569]">
                <div className="w-5 h-5 rounded-full bg-[#FF7E95]/20 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>每日记录 6 件好事</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#475569]">
                <div className="w-5 h-5 rounded-full bg-[#FF7E95]/20 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>高级 AI 分析报告</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#475569]">
                <div className="w-5 h-5 rounded-full bg-[#FF7E95]/20 flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
                <span>专属徽章和装饰</span>
              </div>
            </div>

            <motion.button
              onClick={onShowVIPUpgrade}
              className="w-full py-3 rounded-[20px] text-white font-medium"
              style={{
                background: 'linear-gradient(135deg, #FFD56B, #FF9F43)',
                boxShadow: '0 4px 12px rgba(255, 159, 67, 0.4)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              立即升级
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* VIP身份展示 */}
      {isVIP && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] p-6 backdrop-blur-[10px] mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 107, 0.4), rgba(255, 159, 67, 0.4))',
            boxShadow: `
              inset 2px 2px 5px rgba(255, 255, 255, 1),
              inset -3px -3px 7px rgba(0, 0, 0, 0.05),
              0 0 30px rgba(255, 159, 67, 0.3)
            `,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFD56B, #FF9F43)',
                }}
              >
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg text-[#475569] font-medium">VIP 会员</h3>
                <p className="text-sm text-[#94A3B8]">有效期至 2027-03-02</p>
              </div>
            </div>
            <button className="text-sm text-[#FF9F43]">续费 →</button>
          </div>
        </motion.div>
      )}

      {/* AI月度报告 */}
      {isLoggedIn && !isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] p-6 backdrop-blur-[10px] mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 126, 149, 0.2), rgba(255, 215, 107, 0.2))',
            boxShadow: `
              inset 2px 2px 5px rgba(255, 255, 255, 1),
              inset -3px -3px 7px rgba(0, 0, 0, 0.05),
              10px 10px 20px rgba(166, 180, 200, 0.15)
            `,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#FF7E95]" />
              <h3 className="text-lg text-[#475569]">AI 月度分析</h3>
            </div>
            <button className="text-sm text-[#FF7E95]">查看详情 →</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7E95]/20 flex items-center justify-center flex-shrink-0">
                <Heart size={20} className="text-[#FF7E95]" />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-medium mb-1">
                  幸福密码
                </p>
                <p className="text-sm text-[#94A3B8]">
                  人际关系是你最大的能量来源
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFD56B]/20 flex items-center justify-center flex-shrink-0">
                <Zap size={20} className="text-[#FFD56B]" />
              </div>
              <div>
                <p className="text-sm text-[#475569] font-medium mb-1">
                  成长建议
                </p>
                <p className="text-sm text-[#94A3B8]">
                  试着在记录中加入更多具体细节
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94A3B8]">本月幸福指数</span>
              <span className="text-[#FF7E95] font-medium">68%</span>
            </div>
            <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FF7E95, #FFD56B)',
                }}
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 用户信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isLoggedIn && !isGuest ? 0.1 : 0 }}
        className="rounded-[32px] p-6 backdrop-blur-[10px] mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            10px 10px 20px rgba(166, 180, 200, 0.15)
          `,
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          {/* 头像 */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #FF7E95, #FFD56B)',
            }}
          >
            {user?.avatar || '👤'}
          </div>

          <div className="flex-1">
            {isLoggedIn ? (
              <>
                <h3 className="text-xl text-[#475569] mb-1">{user.name}</h3>
                {isGuest && (
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#94A3B8]/20 text-xs text-[#94A3B8]">
                      游客模式
                    </span>
                  </div>
                )}
                {user.email && (
                  <p className="text-xs text-[#94A3B8] mb-2">{user.email}</p>
                )}
                <p className="text-sm text-[#94A3B8]">
                  已坚持 45 天 · 种下了 135 件美好
                </p>
              </>
            ) : (
              <div>
                <p className="text-[#94A3B8] mb-2">登录后查看完整数据</p>
                <button
                  onClick={onShowLogin}
                  className="px-6 py-2 rounded-full text-white text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                  }}
                >
                  登录 / 注册
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 游客提示升级 */}
        {isGuest && (
          <div className="mb-4 p-4 rounded-[20px] bg-[#FFD56B]/20 border border-[#FFD56B]/30">
            <p className="text-sm text-[#475569] mb-2">
              💡 升级账号，数据云端同步，永不丢失
            </p>
            <button
              onClick={onShowLogin}
              className="text-sm text-[#FF7E95] font-medium"
            >
              立即升级 →
            </button>
          </div>
        )}

        {/* 快捷操作 */}
        {isLoggedIn && (
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] bg-white/60 hover:bg-white/80 transition-colors active:scale-95"
            >
              <Share2 size={18} className="text-[#FF7E95]" />
              <span className="text-sm text-[#475569]">分享</span>
            </button>

            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] bg-white/60 hover:bg-white/80 transition-colors active:scale-95"
            >
              <Download size={18} className="text-[#FF9F43]" />
              <span className="text-sm text-[#475569]">导出</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* 数据统计 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[24px] p-4 backdrop-blur-[10px] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: `
                  inset 2px 2px 5px rgba(255, 255, 255, 1),
                  inset -3px -3px 7px rgba(0, 0, 0, 0.05),
                  10px 10px 20px rgba(166, 180, 200, 0.15)
                `,
              }}
            >
              <Icon size={24} style={{ color: stat.color }} className="mx-auto mb-2" />
              <div className="text-2xl mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-[#94A3B8]">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* 成就墙 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[32px] p-6 backdrop-blur-[10px] mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            10px 10px 20px rgba(166, 180, 200, 0.15)
          `,
        }}
      >
        <h3 className="text-lg text-[#475569] mb-4">成就徽章</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="aspect-square rounded-[20px] p-3 flex flex-col items-center justify-center"
              style={{
                background: achievement.unlocked
                  ? 'rgba(255, 215, 107, 0.2)'
                  : 'rgba(148, 163, 184, 0.1)',
                border: achievement.unlocked
                  ? '2px solid rgba(255, 215, 107, 0.3)'
                  : '2px solid transparent',
              }}
            >
              <div
                className="text-3xl mb-1"
                style={{
                  filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                  opacity: achievement.unlocked ? 1 : 0.3,
                }}
              >
                {achievement.emoji}
              </div>
              <div
                className="text-xs text-center"
                style={{
                  color: achievement.unlocked ? '#475569' : '#94A3B8',
                }}
              >
                {achievement.name}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 设置选项 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <button className="w-full text-left px-6 py-4 rounded-[24px] bg-white/70 hover:bg-white/90 transition-colors flex items-center justify-between">
          <span className="text-[#475569]">隐私设置</span>
          <span className="text-[#94A3B8]">→</span>
        </button>

        <button className="w-full text-left px-6 py-4 rounded-[24px] bg-white/70 hover:bg-white/90 transition-colors flex items-center justify-between">
          <span className="text-[#475569]">通知管理</span>
          <span className="text-[#94A3B8]">→</span>
        </button>

        <button className="w-full text-left px-6 py-4 rounded-[24px] bg-white/70 hover:bg-white/90 transition-colors flex items-center justify-between">
          <span className="text-[#475569]">关于我们</span>
          <span className="text-[#94A3B8]">→</span>
        </button>

        {isLoggedIn && (
          <button 
            onClick={onLogout}
            className="w-full text-left px-6 py-4 rounded-[24px] bg-white/70 hover:bg-white/90 transition-colors flex items-center justify-between text-[#94A3B8]"
          >
            <div className="flex items-center gap-2">
              <LogOut size={18} />
              <span>退出登录</span>
            </div>
          </button>
        )}
      </motion.div>
    </div>
  );
}