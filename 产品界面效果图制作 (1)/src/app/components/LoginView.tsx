import { motion } from 'motion/react';
import { X, Mail, Chrome } from 'lucide-react';
import { useState } from 'react';

interface LoginViewProps {
  onClose: () => void;
  onLogin: (user: { id: string; name: string; email?: string; avatar: string; type: 'guest' | 'wechat' | 'google' | 'email' }) => void;
}

export function LoginView({ onClose, onLogin }: LoginViewProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleWechatLogin = () => {
    // 模拟微信登录
    onLogin({
      id: 'wx_' + Date.now(),
      name: '温暖的小雅',
      avatar: '🌸',
      type: 'wechat',
    });
  };

  const handleGoogleLogin = () => {
    // 模拟Google登录
    onLogin({
      id: 'google_' + Date.now(),
      name: 'Sunshine User',
      email: 'user@gmail.com',
      avatar: '🌟',
      type: 'google',
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && (!name || !email || !password)) return;
    if (!isRegister && (!email || !password)) return;

    onLogin({
      id: 'email_' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      avatar: '💌',
      type: 'email',
    });
  };

  const handleGuestLogin = () => {
    onLogin({
      id: 'guest_' + Date.now(),
      name: '游客' + Math.floor(Math.random() * 10000),
      avatar: '👤',
      type: 'guest',
    });
    onClose();
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

      {/* 登录卡片 */}
      <motion.div
        className="relative w-full max-w-md rounded-[32px] backdrop-blur-[20px] p-8"
        style={{
          background: '#FFF9F0',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={20} className="text-[#475569]" />
        </button>

        {!showEmailForm ? (
          <>
            {/* 标题 */}
            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#475569] mb-2">欢迎来到三件好事</h2>
              <p className="text-sm text-[#94A3B8]">记录美好，养育心灵的树</p>
            </div>

            {/* 登录选项 */}
            <div className="space-y-4">
              {/* 微信登录 */}
              <button
                onClick={handleWechatLogin}
                className="w-full py-4 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95"
                style={{
                  background: '#07C160',
                  color: 'white',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 9.5C8.5 10.05 8.05 10.5 7.5 10.5C6.95 10.5 6.5 10.05 6.5 9.5C6.5 8.95 6.95 8.5 7.5 8.5C8.05 8.5 8.5 8.95 8.5 9.5ZM12.5 8.5C11.95 8.5 11.5 8.95 11.5 9.5C11.5 10.05 11.95 10.5 12.5 10.5C13.05 10.5 13.5 10.05 13.5 9.5C13.5 8.95 13.05 8.5 12.5 8.5ZM10 2C5.03 2 1 5.58 1 10C1 12.25 2.09 14.27 3.87 15.67L3 19L6.5 17.43C7.62 17.8 8.79 18 10 18C14.97 18 19 14.42 19 10C19 5.58 14.97 2 10 2ZM16.5 15C16.5 15.55 16.05 16 15.5 16C14.95 16 14.5 15.55 14.5 15C14.5 14.45 14.95 14 15.5 14C16.05 14 16.5 14.45 16.5 15ZM18.5 14C17.95 14 17.5 14.45 17.5 15C17.5 15.55 17.95 16 18.5 16C19.05 16 19.5 15.55 19.5 15C19.5 14.45 19.05 14 18.5 14ZM23 15C23 12.58 21.42 10.5 19 9.5C19 6.47 15.87 4 12 4C8.13 4 5 6.47 5 9.5C5 9.67 5.01 9.83 5.03 10C2.37 11.19 1 13.42 1 16C1 19.03 3.58 21.5 7 21.5C7.83 21.5 8.62 21.33 9.33 21.03L12 22L13.67 21.03C14.38 21.33 15.17 21.5 16 21.5C19.42 21.5 22 19.03 22 16C22 15.66 21.97 15.33 21.92 15H23Z"/>
                </svg>
                <span className="font-medium">微信登录</span>
              </button>

              {/* Google登录 */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-4 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 bg-white border-2 border-[#94A3B8]/30"
              >
                <Chrome size={24} className="text-[#4285F4]" />
                <span className="text-[#475569] font-medium">Google 登录</span>
              </button>

              {/* 邮箱登录 */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full py-4 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95 bg-white border-2 border-[#94A3B8]/30"
              >
                <Mail size={24} className="text-[#FF7E95]" />
                <span className="text-[#475569] font-medium">邮箱登录</span>
              </button>

              {/* 游客登录 */}
              <button
                onClick={handleGuestLogin}
                className="w-full py-4 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-95"
                style={{
                  background: 'rgba(148, 163, 184, 0.2)',
                }}
              >
                <span className="text-[#94A3B8] font-medium">游客登录（数据仅保存本地）</span>
              </button>
            </div>

            {/* 协议提示 */}
            <p className="text-xs text-[#94A3B8] text-center mt-6">
              登录即表示同意《用户协议》和《隐私政策》
            </p>
          </>
        ) : (
          <>
            {/* 邮箱登录表单 */}
            <div className="mb-6">
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-[#FF7E95] text-sm mb-4"
              >
                ← 返回
              </button>
              <h2 className="text-2xl text-[#475569] mb-2">
                {isRegister ? '注册账号' : '邮箱登录'}
              </h2>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm text-[#475569] mb-2">昵称</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入昵称"
                    className="w-full px-4 py-3 rounded-[20px] bg-white border-2 border-[#94A3B8]/30 outline-none focus:border-[#FF7E95] text-[#475569]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-[#475569] mb-2">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full px-4 py-3 rounded-[20px] bg-white border-2 border-[#94A3B8]/30 outline-none focus:border-[#FF7E95] text-[#475569]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#475569] mb-2">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-4 py-3 rounded-[20px] bg-white border-2 border-[#94A3B8]/30 outline-none focus:border-[#FF7E95] text-[#475569]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-[24px] text-white font-medium transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                }}
              >
                {isRegister ? '注册' : '登录'}
              </button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="w-full text-sm text-[#FF7E95] text-center"
              >
                {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
