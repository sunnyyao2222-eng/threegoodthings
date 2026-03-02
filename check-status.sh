#!/bin/bash

echo "========================================="
echo "三件好事 - 系统状态检查"
echo "========================================="
echo ""

# 检查后端
echo "🔍 检查后端服务器..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 后端运行正常: http://localhost:3000"
    curl -s http://localhost:3000/health | grep -o '"message":"[^"]*"'
else
    echo "❌ 后端未运行"
    echo "   请运行: cd backend && npm run dev"
fi

echo ""

# 检查前端
echo "🔍 检查前端服务器..."
if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "✅ 前端运行正常: http://localhost:5174"
else
    echo "❌ 前端未运行"
    echo "   请运行: npm run dev:h5"
fi

echo ""

# 检查MongoDB
echo "🔍 检查 MongoDB 连接..."
if curl -s http://localhost:27017 > /dev/null 2>&1; then
    echo "✅ MongoDB 运行中"
else
    echo "⚠️  MongoDB 未运行（可选）"
    echo "   游客模式仍可使用"
    echo "   如需云端同步，请安装 MongoDB"
fi

echo ""
echo "========================================="
echo "📝 使用说明"
echo "========================================="
echo "1. 打开浏览器访问: http://localhost:5174"
echo "2. 自动以游客身份登录"
echo "3. 开始记录你的三件好事"
echo ""
echo "💡 提示："
echo "- 游客数据保存在浏览器本地"
echo "- 配置 MongoDB 后可启用云端同步"
echo "- 配置 OpenAI API 后可使用 AI 功能"
echo "========================================="
