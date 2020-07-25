const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ProfileHeadline = sequelize.define("profileHeadlines", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  type: Sequelize.STRING,

  skills: Sequelize.STRING,
  profiles: Sequelize.STRING,
  skillString: Sequelize.STRING,
  profileString: Sequelize.STRING,
  college: Sequelize.STRING,
  phone: Sequelize.STRING,

  title: {
    type: Sequelize.STRING,
  },

  headline: {
    type: Sequelize.TEXT,
  },

  imgUrl: Sequelize.STRING,
  experienceQty: Sequelize.INTEGER,
  projectQty: Sequelize.INTEGER,
  certificationQty: Sequelize.INTEGER,
  achievementQty: Sequelize.INTEGER,
});

module.exports = ProfileHeadline;
