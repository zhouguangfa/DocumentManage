const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

class User {
  constructor(username, passwordHash, email, id = null) {
    this.id = id || Date.now().toString();
    this.username = username;
    this.password = passwordHash;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  // 创建新用户
  static async create(userData) {
    const { username, password, email } = userData;
    const user = new User(username, password, email);
    await this.save(user);
    return user;
  }

  // 保存用户到文件
  static async save(user) {
    const users = await this.getAll();
    users.push(user);
    await this.writeUsers(users);
    return user;
  }

  // 获取所有用户
  static async getAll() {
    const usersPath = path.join(__dirname, '../data/users.json');
    if (!fs.existsSync(usersPath)) {
      return [];
    }
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data || '[]');
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    const users = await this.getAll();
    return users.find(user => user.username === username);
  }

  // 根据 ID 查找用户
  static async findById(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  // 写入用户数据到文件
  static async writeUsers(users) {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const usersPath = path.join(dataDir, 'users.json');
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }
}

module.exports = User;