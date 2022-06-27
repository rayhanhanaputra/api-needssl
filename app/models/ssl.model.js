module.exports = (sequelize, Sequelize) => {
    const Ssl = sequelize.define("ssls", {
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
    return Ssl;
  };