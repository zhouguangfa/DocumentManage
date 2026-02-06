const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const DATA_DIR = path.join(__dirname, '../data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 确保用户文件存在
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// 获取所有用户
function getUsers() {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
}

// 保存用户
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 查找用户
function findUserByUsername(username) {
    const users = getUsers();
    return users.find(user => user.username === username);
}

// 创建用户
async function createUser(username, password, email) {
    const users = getUsers();
    
    // 检查用户名是否已存在
    if (users.some(user => user.username === username)) {
        throw new Error('用户名已存在');
    }
    
    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
}

// 验证用户密码
async function validatePassword(username, password) {
    const user = findUserByUsername(username);
    if (!user) {
        return false;
    }
    
    return await bcrypt.compare(password, user.password);
}

// 获取用户信息（不包含密码）
function getUserInfo(username) {
    const user = findUserByUsername(username);
    if (!user) {
        return null;
    }
    
    const { password, ...userInfo } = user;
    return userInfo;
}

module.exports = {
    createUser,
    validatePassword,
    getUserInfo,
    findUserByUsername
};