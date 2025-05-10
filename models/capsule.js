import sequelize from "../config/databaseConnection.js";
import { DataTypes } from "sequelize";
// import { DataTypes, DataTypes, DataTypes, DataTypes } from "sequelize/types";
import User from "./user.js";

const Capsule = sequelize.define('Capsule', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    message:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    unlock_at:{
        type:DataTypes.DATE,
        allowNull:false
    },
    unlock_code:{
        type:DataTypes.STRING,
        allowNull:false
    },
    expired:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    }

})

Capsule.belongsTo(User, {foreignKey:'email'})
User.hasMany(Capsule, {foreignKey:'email'})

export default Capsule;