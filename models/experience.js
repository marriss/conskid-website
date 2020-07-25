const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Experience = sequelize.define("experiences", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  title: Sequelize.STRING,
  employmentType: Sequelize.STRING,
  company: Sequelize.STRING,
  location: Sequelize.STRING,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE,
  headline: Sequelize.TEXT,
  description: Sequelize.TEXT,
});

module.exports = Experience;
