# DocumentManage

一个简单的文档管理系统，支持用户认证、文件上传和搜索功能。

## 功能特性

- **用户认证**: 注册、登录、JWT 令牌验证
- **文档管理**: 上传、查看、删除文档
- **搜索功能**: 按文档名称搜索
- **数据库支持**: PostgreSQL 数据库
- **文件存储**: 本地文件系统存储上传的文件

## 技术栈

- **前端**: HTML, CSS, JavaScript
- **后端**: Node.js, Express
- **数据库**: PostgreSQL (通过 Sequelize ORM)
- **认证**: JWT, bcrypt
- **部署**: Docker, Docker Compose

## 本地开发

### 环境要求
- Node.js 18+
- PostgreSQL 12+

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/zhouguangfa/DocumentManage.git
cd DocumentManage
```

2. 安装依赖
```bash
npm install
```

3. 配置 PostgreSQL
   - 创建数据库: `documentmanage`
   - 更新 `config/database.js` 中的连接配置

4. 启动应用
```bash
node server.js
```

5. 访问应用
```
http://localhost:3000
```

## Docker 部署

### 使用 Docker Compose（推荐）

1. 克隆项目
```bash
git clone https://github.com/zhouguangfa/DocumentManage.git
cd DocumentManage
```

2. 启动服务
```bash
docker-compose up -d
```

3. 访问应用
```
http://localhost:3000
```

### 直接使用 Docker

1. 构建镜像
```bash
docker build -t documentmanage .
```

2. 运行容器
```bash
docker run -d -p 3000:3000 --name documentmanage documentmanage
```

## API 文档

### 用户认证
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/user` - 获取当前用户信息

### 文档管理
- `POST /api/upload` - 上传文档
- `GET /api/documents` - 获取文档列表
- `GET /api/search?q=关键词` - 搜索文档
- `DELETE /api/documents/:id` - 删除文档
- `GET /api/documents/:id/file` - 下载文档文件

## 数据持久化

- **PostgreSQL**: 用户数据和文档元数据
- **本地文件系统**: 上传的原始文件 (`uploads/` 目录)

## 环境变量

- `PORT`: 应用端口 (默认: 3000)
- `JWT_SECRET`: JWT 密钥 (默认: 'document_manage_secret_key_2026')
- `DB_HOST`: PostgreSQL 主机 (默认: 'localhost')
- `DB_PORT`: PostgreSQL 端口 (默认: 5432)
- `DB_NAME`: 数据库名称 (默认: 'documentmanage')
- `DB_USER`: 数据库用户名 (默认: 'postgres')
- `DB_PASSWORD`: 数据库密码 (默认: 'postgres')

## 许可证

MIT License