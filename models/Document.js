const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uploadDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'documents',
  timestamps: false
});

// 自定义方法
Document.save = async function(documentData) {
  return await this.create(documentData);
};

Document.findByUserId = async function(userId) {
  return await this.findAll({
    where: { userId: userId },
    order: [['uploadDate', 'DESC']]
  });
};

Document.searchByUserId = async function(userId, query) {
  const searchRegex = '%' + query + '%';
  return await this.findAll({
    where: {
      userId: userId,
      [Op.or]: [
        { name: { [Op.like]: searchRegex } },
        { originalName: { [Op.like]: searchRegex } }
      ]
    },
    order: [['uploadDate', 'DESC']]
  });
};

Document.deleteByIdAndUserId = async function(id, userId) {
  const result = await this.destroy({
    where: { id: id, userId: userId }
  });
  return result > 0;
};

module.exports = Document;