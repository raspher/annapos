import {AuthPayload} from "./AuthPayload.js";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}