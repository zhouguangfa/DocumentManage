# DocumentManage - 文档管理系统

一个简单的文档管理 Web 应用，支持用户认证、文件上传和搜索功能。

## 功能特性

✅ **用户认证**：
- 用户注册和登录
- JWT 令牌认证
- 密码加密存储

✅ **文档管理**：
- 上传文档（支持任意文件类型）
- 查看已上传文档列表
- 删除文档
- 下载文档

✅ **搜索功能**：
- 按文档名称搜索
- 按原始文件名搜索
- 实时搜索结果

✅ **数据存储**：
- 用户数据：JSON 文件存储
- 文档元数据：JSON 文件存储  
- 上传文件：本地文件系统存储

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **后端**: Node.js, Express
- **认证**: JWT, bcrypt
- **存储**: 本地文件系统 (无需数据库)

## 安装和运行

1. 克隆仓库：
   ```bash
   git clone https://github.com/zhouguangfa/DocumentManage.git
   cd DocumentManage
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动服务器：
   ```bash
   node server.js
   ```

4. 访问应用：
   - 打开浏览器访问 `http://localhost:3002`
   - 注册新账户或登录现有账户
   - 开始上传和管理文档

## API 端点

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录  
- `GET /api/user` - 获取当前用户信息
- `POST /api/upload` - 上传文档
- `GET /api/documents` - 获取文档列表
- `GET /api/search?q=关键词` - 搜索文档
- `DELETE /api/documents/:id` - 删除文档
- `GET /api/documents/:id/file` - 下载文档文件

## 目录结构

```
DocumentManage/
├── server.js          # 主服务器文件
├── index.html         # 主页面
├── login.html         # 登录/注册页面  
├── style.css          # 样式文件
├── uploads/           # 上传的文件存储目录
└── data/              # 用户和文档元数据存储目录
    ├── users.json     # 用户数据
    └── documents/     # 文档元数据
```

## 注意事项

- 所有数据都存储在本地文件系统中
- 生产环境建议使用真正的数据库（如 MongoDB、PostgreSQL）
- JWT 密钥在生产环境中应该使用环境变量配置
- 文件上传大小限制可以通过 multer 配置调整

## 许可证

MIT License