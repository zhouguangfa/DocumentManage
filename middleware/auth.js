const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 密钥（生产环境应该使用环境变量）
const JWT_SECRET = 'document-manage-secret-key-2026';

// 验证 JWT token 的中间件
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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

// 生成 JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = { authenticateToken, generateToken };