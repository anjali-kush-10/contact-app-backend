import { Sequelize } from "sequelize";
import dbConfig from "./dbConfig.js";

// import dotenv from 'dotenv';
// dotenv.config();

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

try {
    sequelize.authenticate().then((res) => {
        console.log("database connection has established successfully...");
    });
}
catch (error) {
    console.log("unable to connect with database", error);
}

export default sequelize;