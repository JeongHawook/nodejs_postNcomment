"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Posts, {
                sourceKey: "userId",
                foreignKey: "userId",
            });
            this.hasMany(models.Comments, {
                sourceKey: "userId",
                foreignKey: "userId",
            });
            this.hasOne(models.UserInfos, {
                // 2. UserInfos 모델에게 1:1 관계 설정을 합니다.
                sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
                foreignKey: "userId", // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
            });
            this.hasMany(models.UserHistories, {
                // 2. UserHistories 모델에게 1:N 관계 설정을 합니다.
                sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
                foreignKey: "UserId", // 4. UserHistories 모델의 UserId 컬럼과 연결합니다.
            });
        }
    }
    Users.init(
        {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            nickname: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Users",
        }
    );
    return Users;
};
