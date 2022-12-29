const { DataTypes } = require('sequelize');

const db = require('../db/conn');

// User
const User = require('./User');

const Thought = db.define('Thought', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  like: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Thought.belongsTo(User);
User.hasMany(Thought);

module.exports = Thought;
