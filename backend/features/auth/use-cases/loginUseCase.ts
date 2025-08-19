import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserRepository} from "../db/user.repository.js";
import {config} from "../../common/config.js";

export class LoginUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error("Invalid credentials");

        return jwt.sign({userId: user.id}, config.JWT_SECRET, {expiresIn: "1h"});
    }
}