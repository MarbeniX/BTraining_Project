import { CorsOptions } from "cors";
import colors from "colors";

export const consConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(colors.red.bold("Not allowed by CORS")));
        }
    },
};
