const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Education = sequelize.define("educations", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    school: Sequelize.STRING,
    degree: Sequelize.STRING,
    fieldOfStudy: Sequelize.STRING,
    startYear: Sequelize.STRING,
    endYear: Sequelize.STRING,
    activities: Sequelize.TEXT,
    description: Sequelize.TEXT,
});

module.exports = Education;
