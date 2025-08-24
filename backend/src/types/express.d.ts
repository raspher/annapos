import {AuthPayload} from "./AuthPayload.ts";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}