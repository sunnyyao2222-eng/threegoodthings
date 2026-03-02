@echo off
echo ========================================
echo 三件好事 - 快速启动脚本
echo ========================================
echo.

echo [1/3] 检查 MongoDB...
echo 如果没有安装 MongoDB，请访问：https://www.mongodb.com/try/download/community
echo 或者使用 MongoDB Atlas 云数据库（免费）：https://www.mongodb.com/cloud/atlas
echo.

echo [2/3] 启动后端服务器...
cd backend
start cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
cd ..

echo [3/3] 启动前端服务器...
start cmd /k "npm run dev:h5"

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3000
echo.
echo 按任意键关闭此窗口...
pause >nul
