# Vercel 部署指南

## 前提条件
- 代码已推送到 GitHub
- Vercel 项目已连接到 GitHub 仓库
- Supabase 项目已创建并配置

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

### 1. 进入 Vercel 项目设置
1. 访问 https://vercel.com/dashboard
2. 选择你的项目 `threegoodthings`
3. 点击 `Settings` 标签
4. 点击左侧菜单的 `Environment Variables`

### 2. 添加环境变量

添加以下变量（适用于 Production, Preview, Development 环境）：

```
VITE_SUPABASE_URL=https://vebrsngzdlxyzjbklssf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYnJzbmd6ZGx4eXpqYmtsc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NzI5NzcsImV4cCI6MjA1NjU0ODk3N30.Yx-Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5Yx5
```

**注意**：实际的 `VITE_SUPABASE_ANON_KEY` 请从 `supabase-config.txt` 文件中获取完整的 JWT token。

### 3. 可选环境变量

如果需要 Google 登录功能：
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

如果需要 AI 对话功能（需要后端 API）：
```
VITE_API_URL=https://your-backend-api.com/api
```

## 部署步骤

### 方式一：自动部署（推荐）
1. 推送代码到 GitHub：
```bash
git add .
git commit -m "feat: 更新配置"
git push
```

2. Vercel 会自动检测到更改并开始部署
3. 等待部署完成（通常 1-2 分钟）
4. 访问 https://threegoodthings.vercel.app 查看结果

### 方式二：手动触发部署
1. 在 Vercel Dashboard 中找到你的项目
2. 点击 `Deployments` 标签
3. 点击右上角的 `Redeploy` 按钮
4. 选择 `Use existing Build Cache` 或 `Rebuild`
5. 点击 `Redeploy` 确认

## 验证部署

部署完成后，测试以下功能：

### 1. 基础功能
- [ ] 页面能正常加载
- [ ] 样式显示正常
- [ ] 语言切换功能正常

### 2. 认证功能
- [ ] 点击"游客继续"能创建匿名账号
- [ ] 能创建好事记录
- [ ] 能查看今日记录
- [ ] 能注册新账号
- [ ] 能登录已有账号

### 3. 数据功能
- [ ] 记录能正常保存到 Supabase
- [ ] 积分能正常累加
- [ ] 连续天数能正常更新
- [ ] 树木阶段能正常显示

### 4. 检查浏览器控制台
打开浏览器开发者工具（F12），检查：
- [ ] 没有 CORS 错误
- [ ] 没有 Supabase 连接错误
- [ ] 没有 JavaScript 错误

## 常见问题

### 1. 环境变量不生效
**问题**：添加环境变量后，应用仍然无法连接 Supabase

**解决方案**：
- 确保环境变量名称正确（必须以 `VITE_` 开头）
- 添加环境变量后需要重新部署
- 在 Vercel Dashboard 中点击 `Redeploy` 按钮

### 2. CORS 错误
**问题**：浏览器控制台显示 CORS 错误

**解决方案**：
- 检查 Supabase 项目设置中的 URL 配置
- 在 Supabase Dashboard > Settings > API 中添加你的 Vercel 域名到允许的来源

### 3. 认证失败
**问题**：无法登录或注册

**解决方案**：
- 检查 Supabase 项目的 Authentication 设置
- 确保启用了 Email 和 Anonymous 认证方式
- 检查 RLS 策略是否正确配置

### 4. 数据无法保存
**问题**：创建记录后数据没有保存

**解决方案**：
- 检查 Supabase 数据库的 RLS 策略
- 确保用户已认证
- 查看浏览器控制台的错误信息

## 监控和日志

### Vercel 日志
1. 在 Vercel Dashboard 中选择你的项目
2. 点击 `Deployments` 标签
3. 点击最新的部署
4. 查看 `Build Logs` 和 `Function Logs`

### Supabase 日志
1. 访问 Supabase Dashboard
2. 选择你的项目
3. 点击左侧菜单的 `Logs`
4. 查看 API 请求日志和错误信息

## 性能优化

### 1. 启用 Vercel Analytics
```bash
npm install @vercel/analytics
```

在 `src/main.ts` 中添加：
```typescript
import { inject } from '@vercel/analytics'
inject()
```

### 2. 启用 Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

### 3. 配置缓存
在项目根目录创建 `vercel.json`：
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 下一步

- [ ] 配置自定义域名
- [ ] 启用 HTTPS（Vercel 自动提供）
- [ ] 配置 Google OAuth（可选）
- [ ] 设置监控和告警
- [ ] 配置 CI/CD 流程
