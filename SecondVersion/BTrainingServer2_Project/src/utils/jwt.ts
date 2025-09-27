import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export const generateJWT = (payload: JwtPayload) => {
    return jwt.sign(
        { id: payload.id, email: payload.email, role: payload.role },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d",
        }
    );
};
