const fs = require('fs');
const path = require('path');

class Document {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.userId = data.userId;
    this.name = data.name;
    this.fileName = data.fileName;
    this.originalName = data.originalName;
    this.size = data.size;
    this.uploadDate = data.uploadDate || new Date().toISOString();
    this.filePath = data.filePath;
  }

  // 保存文档到文件系统
  static async save(documentData) {
    const documentsDir = path.join(__dirname, '..', 'data', 'documents');
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }
    
    const document = new Document(documentData);
    const filePath = path.join(documentsDir, `${document.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(document, null, 2));
    return document;
  }

  // 根据用户ID获取所有文档
  static async findByUserId(userId) {
    const documentsDir = path.join(__dirname, '..', 'data', 'documents');
    if (!fs.existsSync(documentsDir)) {
      return [];
    }
    
    const files = fs.readdirSync(documentsDir);
    const documents = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(documentsDir, file);
        const docData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (docData.userId === userId) {
          documents.push(new Document(docData));
        }
      }
    }
    
    // 按上传日期排序（最新在前）
    return documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }

  // 根据ID和用户ID查找文档
  static async findByIdAndUserId(id, userId) {
    const documentsDir = path.join(__dirname, '..', 'data', 'documents');
    const filePath = path.join(documentsDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const docData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (docData.userId === userId) {
      return new Document(docData);
    }
    
    return null;
  }

  // 删除文档
  static async deleteByIdAndUserId(id, userId) {
    const document = await this.findByIdAndUserId(id, userId);
    if (!document) {
      return false;
    }
    
    const documentsDir = path.join(__dirname, '..', 'data', 'documents');
    const filePath = path.join(documentsDir, `${id}.json`);
    fs.unlinkSync(filePath);
    return true;
  }

  // 搜索文档
  static async searchByUserId(userId, query) {
    const allDocuments = await this.findByUserId(userId);
    const searchRegex = new RegExp(query, 'i');
    
    return allDocuments.filter(doc => 
      searchRegex.test(doc.name) || searchRegex.test(doc.originalName)
    );
  }
}

module.exports = Document;