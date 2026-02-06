const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Document = require('./models/Document');

const app = express();
const PORT = 3002;
const JWT_SECRET = 'document_manage_secret_key_2026';

// 创建必要的目录
const uploadDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 认证中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '访问令牌缺失' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '令牌无效' });
        }
        req.user = user;
        next();
    });
};

// 注册路由
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // 检查用户是否已存在
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: '用户名已存在' });
        }
        
        // 加密密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 创建新用户
        const userData = {
            username,
            password: hashedPassword,
            email
        };
        const user = await User.save(userData);
        
        res.json({ success: true, message: '注册成功' });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '注册失败' });
    }
});

// 登录路由
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 查找用户
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ error: '用户名或密码错误' });
        }
        
        // 验证密码
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: '用户名或密码错误' });
        }
        
        // 生成 JWT 令牌
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            message: '登录成功',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// 获取当前用户信息
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        res.json(user);
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '获取用户信息失败' });
    }
});

// 上传文档（需要认证）
app.post('/api/upload', authenticateToken, upload.single('docFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }

        const docName = req.body.docName || req.file.originalname;
        const documentData = {
            name: docName,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            uploadDate: new Date(),
            filePath: `/uploads/${req.file.filename}`,
            userId: req.user.userId
        };

        const document = await Document.save(documentData);

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

// 获取用户的所有文档
app.get('/api/documents', authenticateToken, async (req, res) => {
    try {
        const documents = await Document.findByUserId(req.user.userId);
        res.json(documents);
    } catch (error) {
        console.error('获取文档列表错误:', error);
        res.status(500).json({ error: '获取文档列表失败' });
    }
});

// 搜索文档
app.get('/api/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: '搜索关键词不能为空' });
        }
        
        const documents = await Document.searchByUserId(req.user.userId, q);
        res.json(documents);
    } catch (error) {
        console.error('搜索文档错误:', error);
        res.status(500).json({ error: '搜索失败' });
    }
});

// 删除文档
app.delete('/api/documents/:id', authenticateToken, async (req, res) => {
    try {
        const success = await Document.deleteByIdAndUserId(req.params.id, req.user.userId);
        
        if (!success) {
            return res.status(404).json({ error: '文档不存在或无权限删除' });
        }
        
        // 删除文件
        const documents = await Document.findByUserId(req.user.userId);
        const document = documents.find(doc => doc.id === req.params.id);
        if (document) {
            const filePath = path.join(uploadDir, document.fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        res.json({ success: true, message: '文档删除成功' });
    } catch (error) {
        console.error('删除文档错误:', error);
        res.status(500).json({ error: '删除失败' });
    }
});

// 获取文档文件（用于下载）
app.get('/api/documents/:id/file', authenticateToken, async (req, res) => {
    try {
        const documents = await Document.findByUserId(req.user.userId);
        const document = documents.find(doc => doc.id === req.params.id);
        
        if (!document) {
            return res.status(404).send('文档不存在或无权限访问');
        }
        
        const filePath = path.join(uploadDir, document.fileName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('文件不存在');
        }
        
        res.download(filePath, document.originalName);
    } catch (error) {
        console.error('获取文档文件错误:', error);
        res.status(500).send('获取文件失败');
    }
});

app.listen(PORT, () => {
    console.log(`DocumentManage 服务器运行在 http://localhost:${PORT}`);
    console.log(`上传目录: ${uploadDir}`);
    console.log(`数据目录: ${dataDir}`);
});