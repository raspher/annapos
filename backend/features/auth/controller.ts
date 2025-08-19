import type {Request, Response} from "express";
import { UserRepository } from "./db/user.repository.js";
import { RegisterUseCase } from "./use-cases/registerUseCase.js";
import { LoginUseCase } from "./use-cases/loginUseCase.js";

const userRepo = new UserRepository();

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const useCase = new RegisterUseCase(userRepo);
        const user = await useCase.execute(email, password);
        res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email } });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const useCase = new LoginUseCase(userRepo);
        const token = await useCase.execute(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Logged in" });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
};

export const me = async (req: Request, res: Response) => {
    // user is attached in middleware
    const user = (req as any).user;
    if (!user) return res.sendStatus(401);

    res.json({ user });
};