# 三件好事 - 项目说明

## 项目概述

基于积极心理学的情绪健康记录产品，使用uni-app框架开发，支持H5网页、微信小程序、iOS/Android APP。

## 技术栈

- **框架**: uni-app + Vue 3 + TypeScript
- **状态管理**: Pinia
- **构建工具**: Vite
- **UI**: 自定义组件 + uni-ui

## 项目结构

```
three-good-things/
├── src/
│   ├── api/              # API接口
│   │   └── index.ts
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   │   └── index.ts
│   ├── pages/            # 页面
│   │   ├── index/        # 首页（录入页）
│   │   ├── login/        # 登录页
│   │   ├── tree/         # 树木页
│   │   ├── profile/      # 个人中心
│   │   └── achievement/  # 成就页
│   ├── store/            # 状态管理
│   │   ├── index.ts
│   │   ├── user.ts       # 用户状态
│   │   ├── record.ts     # 记录状态
│   │   └── tree.ts       # 树木状态
│   ├── types/            # 类型定义
│   │   └── index.ts
│   ├── utils/            # 工具函数
│   │   └── index.ts
│   ├── static/           # 静态资源
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json     # 应用配置
│   └── pages.json        # 页面配置
├── package.json
└── vite.config.ts
```

## 核心功能

### MVP版本 (V1.0)

1. **用户登录**
   - 微信授权登录
   - 用户信息存储

2. **快速录入**
   - 文字输入
   - 语音录入（语音转文字）
   - 图片上传
   - AI即时反馈
   - 离线缓存

3. **虚拟生命系统**
   - 6阶段树木成长
   - 积分计算
   - 成长动效

4. **成就系统**
   - 4个基础徽章
   - 连击记录
   - 里程碑通知

5. **数据存储**
   - 本地存储
   - 云端同步
   - 离线队列

## 开发命令

```bash
# 安装依赖
npm install

# 安装Pinia
npm install pinia

# 开发 - 微信小程序
npm run dev:mp-weixin

# 开发 - H5
npm run dev:h5

# 构建 - 微信小程序
npm run build:mp-weixin

# 构建 - H5
npm run build:h5
```

## 配置说明

### 1. 微信小程序配置

在 `src/manifest.json` 中配置微信小程序AppID：

```json
"mp-weixin": {
  "appid": "你的微信小程序AppID"
}
```

### 2. API配置

在 `src/config/index.ts` 中配置API地址：

```typescript
export const API_BASE_URL = 'https://api.threegoodthings.com'
```

### 3. 环境变量

创建 `.env` 文件：

```
VITE_API_BASE_URL=https://api.threegoodthings.com
```

## 后端API接口

需要实现以下接口：

### 用户相关
- `POST /api/user/wx-login` - 微信登录
- `GET /api/user/info` - 获取用户信息
- `POST /api/user/update` - 更新用户信息

### 记录相关
- `POST /api/record/submit` - 提交好事记录
- `GET /api/record/today` - 获取今日记录
- `GET /api/record/history` - 获取历史记录
- `POST /api/upload/voice` - 上传语音
- `POST /api/upload/image` - 上传图片

### 树木相关
- `GET /api/tree/info` - 获取树木信息
- `POST /api/tree/update` - 更新树木状态

### 成就相关
- `GET /api/achievement/list` - 获取成就列表
- `POST /api/achievement/unlock` - 解锁成就

## 数据模型

详见 `src/types/index.ts`

## 下一步开发

1. ✅ 项目初始化
2. ✅ 用户登录模块
3. ✅ 快速录入界面
4. ⏳ 树木页面
5. ⏳ 个人中心页面
6. ⏳ 成就页面
7. ⏳ 语音录入功能完善
8. ⏳ 图片上传功能完善
9. ⏳ AI分析集成
10. ⏳ 推送通知

## 注意事项

1. 微信小程序需要在微信开发者工具中打开 `dist/dev/mp-weixin` 目录
2. 需要配置合法域名（request、uploadFile、downloadFile）
3. 需要申请相关权限（录音、相机、相册）
4. 离线功能需要处理数据同步逻辑

## 联系方式

如有问题，请联系开发团队。
