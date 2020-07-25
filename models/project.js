const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Project = sequelize.define("projects", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    title: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    link: Sequelize.STRING,
    description: Sequelize.TEXT,
});

module.exports = Project;
