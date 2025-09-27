import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(colors.cyan.bold(`MongoDB connected`));
    } catch (error) {
        console.error(
            colors.red.bold(`Error al conectar a MongoDB : ${error.message}`)
        );
        process.exit(1);
    }
};
