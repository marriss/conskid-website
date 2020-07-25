const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const UserInfo = sequelize.define("userInfos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  first_name: {
    type: Sequelize.STRING,
  },

  last_name: {
    type: Sequelize.STRING,
  },

  address: {
    type: Sequelize.TEXT,
  },

  phone: {
    type: Sequelize.STRING,
  },

  github: {
    type: Sequelize.STRING,
  },

  linkedin: {
    type: Sequelize.STRING,
  },

  facebook: {
    type: Sequelize.STRING,
  },

  instagram: {
    type: Sequelize.STRING,
  },

  twitter: {
    type: Sequelize.STRING,
  },

  skype: {
      type: Sequelize.STRING,
  }
});

module.exports = UserInfo;
