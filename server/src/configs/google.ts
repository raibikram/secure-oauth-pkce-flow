import { Google } from "arctic";
import { env } from "./env";

export const google = new Google(env.googleClientId || "", env.googleClientSecret || "", env.googleRedirectUri || "");