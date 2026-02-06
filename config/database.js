const mongoose = require('mongoose');

// 连接 MongoDB 数据库
async function connectToDatabase() {
  try {
    // 使用本地 MongoDB 实例（生产环境应该使用环境变量）
    const mongoUri = 'mongodb://localhost:27017/documentmanage';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB 数据库连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };