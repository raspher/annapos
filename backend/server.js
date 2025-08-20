import express, {static} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// At the top of your server.js
const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
    console.log(secretKey)
    throw new Error("Missing Secret");
}
const apiPort = process.env.API_PORT;
if (!apiPort) {
    throw new Error("Missing API port");
}

// todo: use database
let users = [{
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
}]

app.get('/', () => express.static("../frontend/dist"))

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign({ userId: user.username }, secretKey, { expiresIn: '1h' });

    res.status(200).send({ token });
});

app.get('/api/test', authenticateToken, async (req, res) => {
    res.status(200).send('works!');
})

app.listen(apiPort, () => {
    console.log(`Server started on port ${apiPort}`);
})