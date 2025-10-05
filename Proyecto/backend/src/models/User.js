const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('worker', 'employer'),
    allowNull: false,
    defaultValue: 'worker'
  },
  // Worker fields
  education: DataTypes.STRING,
  age: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  experience: DataTypes.TEXT,
  gender: DataTypes.STRING,
  
  // Employer fields
  companyName: {
    type: DataTypes.STRING,
    field: 'company_name'
  },
  companyDescription: {
    type: DataTypes.TEXT,
    field: 'company_description'
  }
}, {
  tableName: 'users',
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Método para validar password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// No retornar password en JSON
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;