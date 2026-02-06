const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL 连接配置
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'documentmanage',
});

// 测试数据库连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL 连接失败:', err.stack);
  } else {
    console.log('PostgreSQL 数据库连接成功');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};