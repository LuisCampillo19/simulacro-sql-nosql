import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// testing fast connection
pool.getConnection()
    .then(() => console.log('Connect '))
    .catch((err) => console.error('Conneting error: ', err));