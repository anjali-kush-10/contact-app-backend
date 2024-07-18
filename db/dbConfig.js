import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: "mysql",
};

export default dbConfig;

