const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 确保 uploads 目录存在
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 静态文件服务
app.use(express.static('.'));
app.use('/uploads', express.static(uploadDir));

// 解析 JSON 和 URL 编码数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 存储文档信息
let documents = [];
const documentsFile = 'documents.json';

// 加载已有的文档数据
if (fs.existsSync(documentsFile)) {
    try {
        const data = fs.readFileSync(documentsFile, 'utf8');
        documents = JSON.parse(data);
    } catch (err) {
        console.log('No existing documents data found');
    }
}

// 保存文档数据到文件
function saveDocuments() {
    fs.writeFileSync(documentsFile, JSON.stringify(documents, null, 2));
}

// 获取所有文档
app.get('/api/documents', (req, res) => {
    res.json(documents);
});

// 创建新文档
app.post('/api/documents', upload.single('file'), (req, res) => {
    const { name } = req.body;
    const file = req.file;
    
    if (!name) {
        return res.status(400).json({ error: '文档名称不能为空' });
    }
    
    const document = {
        id: Date.now(),
        name: name,
        fileName: file ? file.filename : null,
        originalName: file ? file.originalname : null,
        uploadDate: new Date().toISOString(),
        fileSize: file ? file.size : 0
    };
    
    documents.push(document);
    saveDocuments();
    
    res.json(document);
});

// 删除文档
app.delete('/api/documents/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: '文档未找到' });
    }
    
    // 删除关联的文件
    if (documents[index].fileName) {
        const filePath = path.join(uploadDir, documents[index].fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    
    documents.splice(index, 1);
    saveDocuments();
    
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`DocumentManage 服务器运行在 http://localhost:${PORT}`);
});