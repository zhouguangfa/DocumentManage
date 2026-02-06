const { Sequelize } = require('sequelize');
require('dotenv').config();

// 从环境变量获取数据库连接信息
const databaseUrl = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'documentmanage'}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // 设置为 true 可以查看 SQL 查询日志
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL 数据库连接成功');
  })
  .catch((error) => {
    console.error('PostgreSQL 连接失败:', error);
  });

module.exports = sequelize;