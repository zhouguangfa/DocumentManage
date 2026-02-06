FROM node:18-slim

# 设置工作目录
WORKDIR /app

# 安装 PostgreSQL 客户端库（用于编译 pg-native）
RUN apt-get update && \
    apt-get install -y postgresql-client libpq-dev python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制应用代码
COPY . .

# 创建必要的目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
CMD ["node", "server.js"]