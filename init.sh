#!/bin/bash

# Neon Protocol MVP - 初始化脚本
# 用途：安装依赖、启动开发服务器、运行测试

set -e

echo "🚀 Initializing Neon Protocol MVP..."

# Step 1: 检查 Node.js 版本
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required, found $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) OK"

# Step 2: 安装依赖
echo "📥 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Step 3: 检查环境变量
echo "🔐 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found, creating template..."
    cat > .env.local << 'EOF'
# Neon Protocol MVP - Environment Variables

# Database
DATABASE_URL="file:./dev.db"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Neon Protocol MVP"

# Wallet (Mock)
NEXT_PUBLIC_PLATFORM_WALLET="0x0000000000000000000000000000000000000000"

# Optional: API Keys
# BRAVE_API_KEY=""
# OPENAI_API_KEY=""
EOF
    echo "✅ .env.local template created"
else
    echo "✅ .env.local exists"
fi

# Step 4: 初始化数据库
echo "🗄️  Initializing database..."
if [ ! -f "prisma/dev.db" ]; then
    npx prisma generate
    npx prisma db push
    echo "✅ Database initialized"
else
    echo "✅ Database already exists"
fi

# Step 5: 运行测试（如果有）
echo "🧪 Running tests..."
if npm test 2>/dev/null; then
    echo "✅ Tests passed"
else
    echo "⚠️  No tests or tests failed (OK for initial setup)"
fi

# Step 6: 启动开发服务器
echo "🌟 Starting development server..."
echo ""
echo "═══════════════════════════════════════════"
echo "  Neon Protocol MVP"
echo "  http://localhost:3000"
echo "═══════════════════════════════════════════"
echo ""

npm run dev
