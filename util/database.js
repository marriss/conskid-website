const Sequelize = require("sequelize");

const sequelize = new Sequelize("conskid", "root", "conskidindia#123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
