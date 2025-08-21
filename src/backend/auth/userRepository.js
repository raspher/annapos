const db = require("../shared/db.js");

const userRepository = {
    async createUser({name, email, passwordHash}) {
        const result = await db.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [name, email, passwordHash]
        );
        return result.rows[0];
    },

    async getUserById(id) {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    },

    async getUserByEmail(email) {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    },

    async getAllUsers() {
        const result = await db.query("SELECT * FROM users");
        return result.rows;
    },

    async updateUser(id, {name, email, passwordHash}) {
        const result = await db.query(
            "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *",
            [name, email, passwordHash, id]
        );
        return result.rows[0];
    },

    async deleteUser(id) {
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    },
};

export default userRepository;
