import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeView } from './components/HomeView';
import { ForestView } from './components/ForestView';
import { ProfileView } from './components/ProfileView';
import { CalendarView } from './components/CalendarView';
import { LoginView } from './components/LoginView';
import { AIChatView } from './components/AIChatView';
import { VIPUpgradeView } from './components/VIPUpgradeView';
import { BottomNav } from './components/BottomNav';
import { toast, Toaster } from 'sonner';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  type: 'guest' | 'wechat' | 'google' | 'email';
}

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'forest' | 'profile'>('home');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showVIPUpgrade, setShowVIPUpgrade] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isVIP, setIsVIP] = useState(false);
  const [streak, setStreak] = useState(7);
  const [treePoints, setTreePoints] = useState(120);
  const [treeStage, setTreeStage] = useState(1);

  // 初始化时检查本地存储的用户信息或自动游客登录
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedVIPStatus = localStorage.getItem('isVIP');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        handleGuestLogin();
      }
    } else {
      handleGuestLogin();
    }

    if (savedVIPStatus) {
      setIsVIP(savedVIPStatus === 'true');
    }
  }, []);

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: '游客' + Math.floor(Math.random() * 10000),
      avatar: '👤',
      type: 'guest',
    };
    setUser(guestUser);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    if (newUser.type !== 'guest') {
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success(`欢迎回来，${newUser.name}！`, {
        description: '你的数据已同步到云端',
      });
    } else {
      toast.success(`以游客身份登录`, {
        description: '数据仅保存在本地',
      });
    }
    setShowLogin(false);
  };

  const handleLogout = () => {
    if (user?.type === 'guest') {
      toast.error('游客数据将被清除');
    } else {
      toast.success('已退出登录');
    }
    localStorage.removeItem('user');
    localStorage.removeItem('isVIP');
    setUser(null);
    setIsVIP(false);
    setTimeout(() => {
      handleGuestLogin();
    }, 500);
  };

  const handleVIPUpgrade = () => {
    setIsVIP(true);
    localStorage.setItem('isVIP', 'true');
    setShowVIPUpgrade(false);
    toast.success('恭喜！VIP 开通成功 🎉', {
      description: '现在可以每日记录 6 件好事了',
    });
  };

  const handleCopyFromForest = (content: string) => {
    toast.success('已复制到我的记录', {
      description: content,
      duration: 2000,
    });
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#475569',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <HomeView
              streak={streak}
              treePoints={treePoints}
              treeStage={treeStage}
              onPointsChange={setTreePoints}
              onStageChange={setTreeStage}
              onShowCalendar={() => setShowCalendar(true)}
              onShowAIChat={() => setShowAIChat(true)}
              isVIP={isVIP}
              onShowVIPUpgrade={() => setShowVIPUpgrade(true)}
            />
          </motion.div>
        )}

        {activeTab === 'forest' && (
          <motion.div
            key="forest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ForestView onCopyToMyRecord={handleCopyFromForest} />
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileView
              user={user}
              onShowLogin={() => setShowLogin(true)}
              onLogout={handleLogout}
              isVIP={isVIP}
              onShowVIPUpgrade={() => setShowVIPUpgrade(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 日历弹窗 */}
      <AnimatePresence>
        {showCalendar && <CalendarView onClose={() => setShowCalendar(false)} />}
      </AnimatePresence>

      {/* 登录弹窗 */}
      <AnimatePresence>
        {showLogin && (
          <LoginView
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>

      {/* AI对话界面 */}
      <AnimatePresence>
        {showAIChat && <AIChatView onClose={() => setShowAIChat(false)} />}
      </AnimatePresence>

      {/* VIP升级弹窗 */}
      <AnimatePresence>
        {showVIPUpgrade && (
          <VIPUpgradeView
            onClose={() => setShowVIPUpgrade(false)}
            onUpgrade={handleVIPUpgrade}
          />
        )}
      </AnimatePresence>

      {/* 底部导航 */}
      <div className={activeTab === 'forest' ? 'forest-nav' : ''}>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 全局样式 */}
      <style>{`
        .forest-nav .fixed > div {
          background: rgba(45, 27, 54, 0.9) !important;
        }
        .forest-nav button svg {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .forest-nav button span {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .forest-nav .relative > div {
          background: rgba(255, 126, 149, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default App;
