# DocumentManage

一个简单的文档管理系统，支持用户认证、文件上传和搜索功能。

## 功能特性

- 🔐 **用户认证**: 注册、登录、JWT 令牌验证
- 📁 **文档管理**: 上传、查看、删除文档
- 🔍 **搜索功能**: 按文档名称搜索
- 💾 **PostgreSQL 数据库**: 使用 Sequelize ORM
- 🐳 **Docker 支持**: 容器化部署

## 技术栈

- **前端**: HTML, CSS, JavaScript (原生)
- **后端**: Node.js, Express
- **数据库**: PostgreSQL (通过 Sequelize ORM)
- **认证**: JWT, bcrypt 密码加密
- **部署**: Docker, Docker Compose

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置数据库
创建 `.env` 文件：
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=documentmanage
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### 3. 启动 PostgreSQL
确保本地 PostgreSQL 服务正在运行。

### 4. 启动应用
```bash
node server.js
```

访问 `http://localhost:3000`

## Docker 部署

### 使用 Docker Compose（推荐）
```bash
# 克隆项目
git clone https://github.com/zhouguangfa/DocumentManage.git
cd DocumentManage

# 启动服务（包含 PostgreSQL）
docker-compose up -d

# 访问应用
http://localhost:3000
```

### 直接使用 Docker
```bash
# 构建镜像
docker build -t documentmanage .

# 运行容器（需要外部 PostgreSQL）
docker run -d -p 3000:3000 --name documentmanage documentmanage

# 访问应用
http://localhost:3000
```

## 环境变量

- `DB_HOST`: PostgreSQL 主机地址
- `DB_PORT`: PostgreSQL 端口
- `DB_USER`: PostgreSQL 用户名
- `DB_PASSWORD`: PostgreSQL 密码
- `DB_NAME`: 数据库名称
- `JWT_SECRET`: JWT 令牌密钥
- `PORT`: 应用端口（默认 3000）

## 目录结构

```
DocumentManage/
├── config/           # 数据库配置
├── models/           # 数据模型 (User, Document)
├── uploads/          # 上传的文件
├── data/             # 本地数据存储（备用）
├── .env              # 环境变量配置
├── .env.example      # 环境变量示例
├── Dockerfile        # Docker 镜像配置
├── docker-compose.yml # Docker Compose 配置
├── server.js         # 主服务器文件
├── index.html        # 前端主页面
├── login.html        # 登录页面
└── style.css         # 样式文件
```

## API 接口

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/user` - 获取用户信息
- `POST /api/upload` - 上传文档
- `GET /api/documents` - 获取文档列表
- `GET /api/search?q=关键词` - 搜索文档
- `DELETE /api/documents/:id` - 删除文档
- `GET /api/documents/:id/file` - 下载文档

## 许可证

MIT License