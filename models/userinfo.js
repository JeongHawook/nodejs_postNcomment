"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserInfos extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, {
                targetKey: "userId",
                foreignKey: "userId",
            });
            // define association here
        }
    }
    UserInfos.init(
        {
            userInfoId: {
                allowNull: false, // NOT NULL
                autoIncrement: true, // AUTO_INCREMENT
                primaryKey: true, // Primary Key (기본키)
                type: DataTypes.INTEGER,
            },
            userId: {
                unique: true,
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
            },
            age: {
                allowNull: false, // NOT NULL
                type: DataTypes.INTEGER,
            },
            gender: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
            },
            nickname: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            profileImage: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false, // NOT NULL
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false, // NOT NULL
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "UserInfos",
        }
    );
    return UserInfos;
};
