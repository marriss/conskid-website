const Sequelize = require("sequelize");

const sequelize = new Sequelize("conskid", "root", "shivani@2", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
