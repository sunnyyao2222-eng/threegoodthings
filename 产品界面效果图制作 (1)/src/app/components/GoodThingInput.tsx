import { motion } from 'motion/react';
import { useState } from 'react';
import { Mic, Image as ImageIcon, X } from 'lucide-react';

interface GoodThingInputProps {
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onFocus: () => void;
  onSubmit: (content: string) => void;
  aiFeedback?: string;
}

export function GoodThingInput({
  index,
  isActive,
  isCompleted,
  onFocus,
  onSubmit,
  aiFeedback,
}: GoodThingInputProps) {
  const [content, setContent] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const placeholders = [
    '今天有什么让你感到开心的小事？',
    '今天你最想记住的是什么？',
    '今天有什么值得感谢的事情？',
  ];

  const handleSubmit = () => {
    if (content.trim() || uploadedImage) {
      onSubmit(content || '分享了一张照片');
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setContent('');
        setUploadedImage(null);
      }, 3000);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    // 模拟语音识别
    setTimeout(() => {
      setContent('这是通过语音输入的内容');
      setIsRecording(false);
    }, 2000);
  };

  const handleImageUpload = () => {
    // 模拟图片上传
    setUploadedImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop');
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return (
    <motion.div
      className="relative"
      animate={{
        scale: isActive && !isCompleted ? [1, 1.01, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: isActive && !isCompleted ? Infinity : 0,
      }}
    >
      {/* 主输入卡片 - Claymorphism风格 */}
      <div
        className="relative rounded-[32px] p-6 backdrop-blur-[10px]"
        style={{
          background: isCompleted 
            ? 'rgba(167, 243, 208, 0.3)'
            : 'rgba(255, 255, 255, 0.7)',
          boxShadow: `
            inset 2px 2px 5px rgba(255, 255, 255, 1),
            inset -3px -3px 7px rgba(0, 0, 0, 0.05),
            10px 10px 20px rgba(166, 180, 200, 0.15)
          `,
        }}
      >
        {/* 已完成内容显示 */}
        {isCompleted ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#A7F3D0] text-white text-sm">
                ✓
              </div>
              <span className="text-sm text-[#94A3B8]">第 {index + 1} 件好事</span>
            </div>
            <div className="text-[#475569]">
              {content || '分享了一张美好的照片'}
            </div>
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="记录"
                className="mt-3 w-full h-40 object-cover rounded-[20px]"
              />
            )}
          </div>
        ) : (
          <div>
            {/* 序号指示器 */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                }}
              >
                {index + 1}
              </div>
              <div className="text-sm text-[#94A3B8]">
                记录第 {index + 1} 件好事
              </div>
            </div>

            {/* 图片预览 */}
            {uploadedImage && (
              <div className="relative mb-4">
                <img
                  src={uploadedImage}
                  alt="上传"
                  className="w-full h-40 object-cover rounded-[20px]"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* 输入框 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={onFocus}
              placeholder={placeholders[index]}
              className="w-full bg-transparent border-none outline-none resize-none text-[#475569] placeholder:text-[#94A3B8] min-h-[80px]"
              style={{
                fontSize: '16px',
              }}
            />
            
            {/* 底部工具栏 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/50">
              <div className="flex items-center gap-3">
                {/* 语音按钮 */}
                <button
                  onClick={handleVoiceInput}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isRecording ? 'bg-[#FF7E95] scale-110' : 'bg-white/60'
                  }`}
                >
                  <Mic
                    size={20}
                    className={isRecording ? 'text-white' : 'text-[#FF7E95]'}
                  />
                </button>

                {/* 图片按钮 */}
                <button
                  onClick={handleImageUpload}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/60 transition-all hover:bg-white/80"
                >
                  <ImageIcon size={20} className="text-[#FFD56B]" />
                </button>
              </div>

              {/* 提交按钮 */}
              {(content.trim() || uploadedImage) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-full text-white transition-transform active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #FF7E95, #FF9F43)',
                    boxShadow: '0 4px 12px rgba(255, 126, 149, 0.3)',
                  }}
                >
                  记录
                </motion.button>
              )}
            </div>

            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-sm text-[#FF7E95]"
              >
                🎤 正在录音...
              </motion.div>
            )}
          </div>
        )}

        {/* AI反馈 */}
        {showFeedback && aiFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-[24px] bg-[#FFD56B]/20 border border-[#FFD56B]/30"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">✨</span>
              <p className="text-sm text-[#475569] flex-1">{aiFeedback}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
