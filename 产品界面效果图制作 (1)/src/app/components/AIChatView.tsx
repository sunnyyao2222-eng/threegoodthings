import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import aiLogo from 'figma:asset/c268dda471e80991145aa7fb4de4c5759a099bb5.png';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatViewProps {
  onClose: () => void;
}

export function AIChatView({ onClose }: AIChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: '你好呀！我是晴幂，你的情绪健康小助手 ✨ 我可以帮你更好地记录和理解生活中的美好时刻，有什么想聊的吗？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        '这听起来真是一件美好的事情！能告诉我更多细节吗？',
        '我能感受到你的心情。这种感觉是怎样的呢？',
        '太棒了！这样的时刻值得被好好记录下来 🌟',
        '听起来你今天过得不错呢！还有什么想分享的吗？',
        '我理解你的感受。记录这些美好的瞬间对心理健康很有帮助哦。',
        '这个建议很好！你可以试试在三件好事中记录下来，让小树也感受到你的快乐~',
      ];

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickReplies = [
    '今天心情不太好',
    '帮我分析一下最近的记录',
    '怎样更好地记录好事？',
    '给我一些建议',
  ];

  const handleQuickReply = (text: string) => {
    setInput(text);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#FFF9F0' }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* 顶部栏 */}
      <div
        className="flex items-center justify-between px-4 py-4 backdrop-blur-[10px]"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={20} className="text-[#475569]" />
        </button>

        <div className="flex items-center gap-3">
          <img src={aiLogo} alt="晴幂" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-[#475569] font-medium">AI助手 · 晴幂</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
              <span className="text-xs text-[#94A3B8]">在线</span>
            </div>
          </div>
        </div>

        <div className="w-10" />
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* 头像 */}
              <div className="flex-shrink-0">
                {message.type === 'ai' ? (
                  <img src={aiLogo} alt="晴幂" className="w-10 h-10 rounded-full" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                    }}
                  >
                    👤
                  </div>
                )}
              </div>

              {/* 消息气泡 */}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-[20px] ${
                  message.type === 'user'
                    ? 'rounded-tr-[4px]'
                    : 'rounded-tl-[4px]'
                }`}
                style={{
                  background:
                    message.type === 'user'
                      ? 'linear-gradient(135deg, #FF7E95, #FF9F43)'
                      : 'rgba(255, 255, 255, 0.9)',
                  color: message.type === 'user' ? 'white' : '#475569',
                  boxShadow: message.type === 'user'
                    ? '0 4px 12px rgba(255, 126, 149, 0.3)'
                    : 'inset 2px 2px 5px rgba(255, 255, 255, 1), inset -3px -3px 7px rgba(0, 0, 0, 0.05)',
                }}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI输入中 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <img src={aiLogo} alt="晴幂" className="w-10 h-10 rounded-full" />
            <div
              className="px-4 py-3 rounded-[20px] rounded-tl-[4px]"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 'inset 2px 2px 5px rgba(255, 255, 255, 1), inset -3px -3px 7px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#FF7E95]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#FF7E95]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#FF7E95]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快捷回复 */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-[#FFD56B]" />
            <span className="text-xs text-[#94A3B8]">快捷问题</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-white/70 text-sm text-[#475569] whitespace-nowrap transition-colors hover:bg-white"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div
        className="px-4 py-4 backdrop-blur-[10px]"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-[24px]"
          style={{
            background: 'white',
            boxShadow: 'inset 2px 2px 5px rgba(255, 255, 255, 1), inset -3px -3px 7px rgba(0, 0, 0, 0.05)',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="和晴幂聊聊..."
            className="flex-1 bg-transparent border-none outline-none text-[#475569] placeholder:text-[#94A3B8]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #FF7E95, #FF9F43)'
                : '#94A3B8',
            }}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
