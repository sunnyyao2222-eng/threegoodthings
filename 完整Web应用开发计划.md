# 完整Web应用开发计划

## 📋 项目架构

### 前端（已有）
- Vue 3 + TypeScript + uni-app
- Pinia 状态管理
- vue-i18n 国际化
- 响应式设计

### 后端（新建）
- Node.js + Express
- MongoDB 数据库
- JWT 认证
- Google OAuth 2.0
- AI API 集成

---

## 🎯 核心功能

### 1. 认证系统 ✅

#### 游客模式（默认）
- 无需注册，直接使用
- 数据保存在 localStorage
- 可随时升级为正式账号

#### 邮箱注册/登录
- 邮箱 + 密码注册
- 邮箱验证
- 密码重置

#### Google 登录
- Google OAuth 2.0
- 一键登录
- 自动创建账号

### 2. 数据同步
- 游客数据：仅本地存储
- 登录用户：云端同步
- 离线支持：本地队列 + 自动同步

### 3. AI 对话功能
- 点击 LOGO 触发
- 浮动对话框
- 支持多轮对话
- 心理健康建议
- 记录分析

---

## 📁 项目结构

```
three-good-things/
├── frontend/                 # 前端（当前项目）
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts      # 认证API
│   │   │   ├── user.ts      # 用户API
│   │   │   ├── record.ts    # 记录API
│   │   │   └── ai.ts        # AI API
│   │   ├── components/
│   │   │   ├── AIChat.vue   # AI对话组件
│   │   │   └── AuthModal.vue # 认证弹窗
│   │   └── store/
│   │       └── auth.ts      # 认证状态
│   └── ...
│
└── backend/                  # 后端（新建）
    ├── src/
    │   ├── routes/
    │   │   ├── auth.ts      # 认证路由
    │   │   ├── user.ts      # 用户路由
    │   │   ├── record.ts    # 记录路由
    │   │   └── ai.ts        # AI路由
    │   ├── models/
    │   │   ├── User.ts      # 用户模型
    │   │   ├── Record.ts    # 记录模型
    │   │   └── Achievement.ts
    │   ├── middleware/
    │   │   ├── auth.ts      # JWT验证
    │   │   └── error.ts     # 错误处理
    │   ├── services/
    │   │   ├── google.ts    # Google OAuth
    │   │   └── ai.ts        # AI服务
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 开发步骤

### Phase 1: 后端基础（2小时）
1. ✅ 初始化 Node.js 项目
2. ✅ 配置 Express + TypeScript
3. ✅ 连接 MongoDB
4. ✅ 创建数据模型
5. ✅ 实现基础路由

### Phase 2: 认证系统（2小时）
1. ✅ JWT 认证中间件
2. ✅ 邮箱注册/登录
3. ✅ Google OAuth 集成
4. ✅ 密码加密和验证

### Phase 3: 前端认证（1.5小时）
1. ✅ 认证 Store
2. ✅ 登录/注册组件
3. ✅ Google 登录按钮
4. ✅ 游客模式切换

### Phase 4: 数据同步（1.5小时）
1. ✅ 记录 CRUD API
2. ✅ 离线队列
3. ✅ 自动同步逻辑
4. ✅ 冲突解决

### Phase 5: AI 对话（1小时）
1. ✅ AI API 集成
2. ✅ 对话组件
3. ✅ LOGO 触发器
4. ✅ 浮动窗口

### Phase 6: 完善和测试（1小时）
1. ✅ 国际化所有页面
2. ✅ 响应式优化
3. ✅ 错误处理
4. ✅ 性能优化

**总计：约 9 小时**

---

## 🔧 技术选型

### 后端框架
- **Express**: 轻量级，易于扩展
- **TypeScript**: 类型安全
- **MongoDB**: 灵活的文档数据库

### 认证
- **JWT**: 无状态认证
- **bcrypt**: 密码加密
- **passport-google-oauth20**: Google 登录

### AI 服务
- **OpenAI API**: GPT-4 对话
- 或 **Claude API**: Anthropic Claude

### 部署
- **前端**: Vercel / Netlify
- **后端**: Railway / Render / Heroku
- **数据库**: MongoDB Atlas（免费层）

---

## 📊 数据库设计

### users 集合
```typescript
{
  _id: ObjectId,
  email: string,
  password: string, // bcrypt hash
  googleId?: string,
  nickname: string,
  avatar: string,
  isGuest: boolean,
  isVIP: boolean,
  vipExpireAt?: Date,
  totalPoints: number,
  treeStage: number,
  streakDays: number,
  createdAt: Date,
  updatedAt: Date
}
```

### records 集合
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  content: string,
  category: string,
  imageUrl?: string,
  voiceUrl?: string,
  aiFeedback?: string,
  points: number,
  date: string, // YYYY-MM-DD
  isPublic: boolean,
  resonanceCount: number,
  createdAt: Date
}
```

---

## 🔐 API 端点

### 认证
- `POST /api/auth/register` - 邮箱注册
- `POST /api/auth/login` - 邮箱登录
- `GET /api/auth/google` - Google 登录
- `POST /api/auth/refresh` - 刷新 Token
- `POST /api/auth/logout` - 登出

### 用户
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `POST /api/user/upgrade` - 游客升级

### 记录
- `POST /api/records` - 创建记录
- `GET /api/records` - 获取记录列表
- `GET /api/records/:id` - 获取单条记录
- `PUT /api/records/:id` - 更新记录
- `DELETE /api/records/:id` - 删除记录

### AI
- `POST /api/ai/chat` - AI 对话
- `POST /api/ai/analyze` - 分析记录

---

## 🎨 UI 设计

### LOGO 触发器
- 固定在右下角
- 点击展开 AI 对话
- 有新消息时显示红点
- 支持拖拽位置

### 认证弹窗
- 居中显示
- 支持切换登录/注册
- Google 一键登录按钮
- 游客模式提示

### AI 对话窗口
- 浮动窗口
- 可最小化
- 支持多轮对话
- 打字动画效果

---

## 🌍 环境变量

### 后端 (.env)
```env
# 服务器
PORT=3000
NODE_ENV=development

# 数据库
MONGODB_URI=mongodb://localhost:27017/three-good-things

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# AI
OPENAI_API_KEY=your-openai-key
# 或
ANTHROPIC_API_KEY=your-claude-key

# 前端地址
FRONTEND_URL=http://localhost:5173
```

### 前端 (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-client-id
```

---

## 📝 下一步行动

1. 创建后端项目结构
2. 实现认证系统
3. 创建前端认证组件
4. 集成 AI 对话功能
5. 完善所有页面
6. 测试和部署

准备开始了吗？
