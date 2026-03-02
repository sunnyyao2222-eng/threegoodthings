import { motion } from 'motion/react';
import { Pencil, Trees, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'forest' | 'profile';
  onTabChange: (tab: 'home' | 'forest' | 'profile') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: '我的树', icon: Pencil },
    { id: 'forest' as const, label: '森林', icon: Trees },
    { id: 'profile' as const, label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-safe">
      <div
        className="mx-4 mb-6 rounded-[28px] backdrop-blur-[10px]"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            0 10px 30px rgba(166, 180, 200, 0.25)
          `,
        }}
      >
        <div className="flex items-center justify-around p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-1 px-6 py-3 rounded-[20px] transition-all active:scale-95"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[20px]"
                    style={{
                      background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                      opacity: 0.15,
                    }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}

                <Icon
                  size={24}
                  style={{
                    color: isActive ? '#FF7E95' : '#94A3B8',
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
                
                <span
                  className="text-xs"
                  style={{
                    color: isActive ? '#FF7E95' : '#94A3B8',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}