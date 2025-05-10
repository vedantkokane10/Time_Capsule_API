import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const localhost = process.env.DB_HOST
const databaseName = process.env.DB_NAME
const userName = process.env.DB_USER
const password = process.env.DB_PASSWORD


const sequelize = new Sequelize(databaseName, userName, password, {
    host: localhost,
    dialect: 'postgres'
})

export default sequelize;