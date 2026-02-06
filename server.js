const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 创建 uploads 目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 使用时间戳 + 原始文件名避免冲突
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 静态文件服务
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// 解析 JSON 请求体
app.use(express.json());

// 存储文档信息的数组（生产环境应该用数据库）
let documents = [];

// 获取所有文档
app.get('/api/documents', (req, res) => {
    res.json(documents);
});

// 上传文档
app.post('/api/upload', upload.single('docFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }

        const docName = req.body.docName || req.file.originalname;
        const document = {
            id: Date.now(),
            name: docName,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
            filePath: `/uploads/${req.file.filename}`
        };

        documents.push(document);
        
        // 保存到文件（持久化）
        fs.writeFileSync(path.join(__dirname, 'documents.json'), JSON.stringify(documents, null, 2));
        
        res.json({ 
            success: true, 
            message: '文档上传成功',
            document: document
        });
    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({ error: '上传失败' });
    }
});

// 删除文档
app.delete('/api/documents/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: '文档不存在' });
    }
    
    // 删除文件
    const filePath = path.join(uploadDir, documents[index].fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    documents.splice(index, 1);
    
    // 更新持久化文件
    fs.writeFileSync(path.join(__dirname, 'documents.json'), JSON.stringify(documents, null, 2));
    
    res.json({ success: true, message: '文档删除成功' });
});

// 获取文档文件（用于下载）
app.get('/api/documents/:id/file', (req, res) => {
    const id = parseInt(req.params.id);
    const document = documents.find(doc => doc.id === id);
    
    if (!document) {
        return res.status(404).send('文档不存在');
    }
    
    const filePath = path.join(uploadDir, document.fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('文件不存在');
    }
    
    res.download(filePath, document.originalName);
});

app.listen(PORT, () => {
    console.log(`DocumentManage 服务器运行在 http://localhost:${PORT}`);
    console.log(`上传目录: ${uploadDir}`);
});