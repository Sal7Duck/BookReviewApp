import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pkg;
const pool = new Pool({
    user: 'postgres',
    password: 'ProceedWithLove!123',
    host: 'localhost',
    port: 5432,
    database: 'bookReviewApp'
});

export default pool;