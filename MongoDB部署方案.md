# MongoDB 部署方案对比

## 方案对比

| 方案 | 价格 | 优点 | 缺点 | 推荐度 |
|------|------|------|------|--------|
| **MongoDB Atlas** | 免费（512MB） | 永久免费、全球部署、易用 | 存储空间有限 | ⭐⭐⭐⭐⭐ |
| **阿里云 MongoDB** | ¥86/月起 | 国内访问快、阿里云生态 | 需要付费 | ⭐⭐⭐⭐ |
| **阿里云 ECS 自建** | ¥50/月起 | 完全控制、灵活 | 需要自己维护 | ⭐⭐⭐ |

---

## 🎯 推荐：MongoDB Atlas（免费方案）

### 为什么推荐 Atlas？
1. **永久免费**：512MB 存储，足够个人项目使用
2. **无需信用卡**：注册即可使用
3. **全球部署**：可选择离你最近的区域
4. **完全托管**：自动备份、监控、安全
5. **易于使用**：5分钟即可完成配置

### 快速开始（5分钟）

#### 1. 注册账号
访问：https://www.mongodb.com/cloud/atlas/register

#### 2. 创建免费集群
- 选择 "Shared" (免费层)
- 云服务商：AWS 或 Google Cloud
- 区域：选择 **ap-southeast-1 (Singapore)** 或 **ap-northeast-1 (Tokyo)**
  - 这两个区域离中国最近，延迟最低
- 集群名称：three-good-things

#### 3. 创建数据库用户
- 用户名：admin
- 密码：生成强密码（保存好）
- 权限：Read and write to any database

#### 4. 配置网络访问
- IP Access List：添加 `0.0.0.0/0`（允许所有IP）
- 或者添加你的服务器IP

#### 5. 获取连接字符串
点击 "Connect" → "Connect your application"
复制连接字符串，格式如下：
```
mongodb+srv://admin:<password>@three-good-things.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 6. 配置到项目
编辑 `backend/.env`：
```env
MONGODB_URI=mongodb+srv://admin:你的密码@three-good-things.xxxxx.mongodb.net/three-good-things?retryWrites=true&w=majority
```

#### 7. 重启后端
```bash
cd backend
npm run dev
```

---

## 🇨🇳 如果必须用阿里云

### 阿里云 MongoDB 云数据库

#### 1. 创建实例
1. 登录阿里云控制台
2. 产品与服务 → 云数据库 MongoDB 版
3. 创建实例：
   - 版本：MongoDB 4.4
   - 规格：1核2GB（最低配置）
   - 存储：20GB
   - 网络：专有网络（VPC）
   - 付费方式：按量付费

#### 2. 配置白名单
- 添加你的服务器IP
- 或添加 `0.0.0.0/0`（不推荐生产环境）

#### 3. 创建账号
- 账号名：admin
- 密码：设置强密码
- 权限：readWrite

#### 4. 获取连接地址
在实例详情页面找到：
```
mongodb://admin:password@dds-xxxxx.mongodb.rds.aliyuncs.com:3717/three-good-things
```

#### 5. 配置到项目
编辑 `backend/.env`：
```env
MONGODB_URI=mongodb://admin:你的密码@dds-xxxxx.mongodb.rds.aliyuncs.com:3717/three-good-things
```

---

## 💰 成本对比

### MongoDB Atlas（免费层）
- **价格**：¥0/月
- **存储**：512MB
- **连接数**：500
- **适用**：个人项目、学习、小型应用

### 阿里云 MongoDB
- **最低配置**：¥86/月（按量付费约 ¥0.12/小时）
- **存储**：20GB
- **适用**：生产环境、企业应用

---

## 🎯 我的建议

### 对于你的项目（三件好事）

**推荐使用 MongoDB Atlas 免费层**，原因：

1. **完全免费**：512MB 足够存储数千条记录
2. **快速开始**：5分钟即可配置完成
3. **无需维护**：自动备份、监控
4. **随时升级**：需要时可升级到付费版

### 何时考虑阿里云 MongoDB？

- 需要更大存储空间（>512MB）
- 需要更高性能
- 已有阿里云生态（ECS、OSS等）
- 企业级应用

---

## 📝 下一步操作

### 立即配置 MongoDB Atlas（推荐）

1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 按照上面的步骤创建免费集群
3. 获取连接字符串
4. 配置到 `backend/.env`
5. 重启后端服务器

### 或者使用阿里云

1. 登录阿里云控制台
2. 搜索"云数据库 MongoDB 版"
3. 创建实例（选择最低配置）
4. 配置白名单和账号
5. 获取连接地址并配置到项目

---

## ✅ 配置完成后

重启后端，你会看到：
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server is running on port 3000
```

然后就可以使用完整功能了：
- ✅ 邮箱注册/登录
- ✅ 云端数据同步
- ✅ 跨设备访问

---

需要我帮你配置吗？告诉我你选择哪个方案，我可以提供详细的配置步骤。
