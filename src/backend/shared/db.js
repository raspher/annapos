import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Dla render/heroku/railway warto włączyć SSL w produkcji:
    ssl: process.env.NODE_ENV === "production" ? {rejectUnauthorized: false} : false,
});

const db = {
    query: (text, params) => pool.query(text, params),
    // przyda się do testów / graceful shutdown
    end: () => pool.end(),
};

export default db;