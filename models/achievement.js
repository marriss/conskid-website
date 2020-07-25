const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Achievement = sequelize.define("achievements", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    title: Sequelize.STRING,
    description: Sequelize.TEXT,
});

module.exports = Achievement;
