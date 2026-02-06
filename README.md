# DocumentManage

一个简单的文档管理系统，支持文档名称输入和文件上传功能。

## 功能特性

- **前端界面**：简洁的文档上传表单
- **后端服务**：Node.js + Express 处理文件上传和存储
- **持久化存储**：文件保存到本地 `uploads/` 目录，元数据保存在 `documents.json`
- **RESTful API**：
  - `POST /api/upload` - 上传文档
  - `GET /api/documents` - 获取文档列表  
  - `DELETE /api/documents/:id` - 删除文档
- **响应式设计**：适配移动设备

## 使用方法

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
   打开浏览器访问 `http://localhost:3001`

## 技术栈

- 前端：HTML5, CSS3, JavaScript (Fetch API)
- 后端：Node.js, Express
- 文件处理：multer
- 存储：本地文件系统

## 注意事项

- 生产环境建议使用数据库替代 `documents.json`
- 文件上传大小限制为 10MB（可配置）
- 所有数据存储在服务器本地