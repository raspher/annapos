import bcrypt from "bcryptjs";
import { UserRepository } from "../db/user.repository.js";

export class RegisterUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, password: string) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new Error("User already exists");

        const hash = await bcrypt.hash(password, 10);
        return this.userRepository.create(email, hash);
    }
}